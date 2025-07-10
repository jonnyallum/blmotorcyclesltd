import paramiko
import csv
import io
import os
from dotenv import load_dotenv
from src.services.supabase_client import supabase_service
import logging
from datetime import datetime

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BikeItFTPSyncSupabase:
    def __init__(self):
        self.ftp_host = os.getenv('FTP_HOST')
        self.ftp_username = os.getenv('FTP_USERNAME')
        self.ftp_password = os.getenv('FTP_PASSWORD')
        self.ftp_port = int(os.getenv('FTP_PORT', 22))
        
    def connect_ftp(self):
        """Establish SFTP connection to Bike It server"""
        try:
            # Create SSH client
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            # Connect to server
            ssh.connect(
                hostname=self.ftp_host,
                port=self.ftp_port,
                username=self.ftp_username,
                password=self.ftp_password,
                timeout=30
            )
            
            # Create SFTP client
            sftp = ssh.open_sftp()
            logger.info(f"Successfully connected to FTP server: {self.ftp_host}")
            
            return ssh, sftp
            
        except Exception as e:
            logger.error(f"Failed to connect to FTP server: {e}")
            raise
    
    def download_product_feed(self, sftp):
        """Download the product feed CSV file from FTP server"""
        try:
            # List files in the directory to find the product feed
            files = sftp.listdir('.')
            logger.info(f"Files in FTP directory: {files}")
            
            # Look for CSV files (common names: products.csv, feed.csv, stock.csv, etc.)
            csv_files = [f for f in files if f.lower().endswith('.csv')]
            
            if not csv_files:
                logger.warning("No CSV files found in FTP directory")
                return None
            
            # Use the first CSV file found (or implement logic to find the correct one)
            feed_file = csv_files[0]
            logger.info(f"Downloading product feed: {feed_file}")
            
            # Download file content
            with sftp.open(feed_file, 'r') as remote_file:
                content = remote_file.read()
                
            return content.decode('utf-8')
            
        except Exception as e:
            logger.error(f"Failed to download product feed: {e}")
            raise
    
    def parse_csv_content(self, csv_content):
        """Parse CSV content and extract product data"""
        try:
            # Parse CSV content
            csv_reader = csv.DictReader(io.StringIO(csv_content))
            products = []
            
            for row in csv_reader:
                # Map CSV columns to our product model
                # Note: Column names may vary, adjust as needed
                product_data = {
                    'sku': row.get('SKU', row.get('sku', row.get('Product Code', ''))),
                    'name': row.get('Name', row.get('name', row.get('Product Name', ''))),
                    'description': row.get('Description', row.get('description', '')),
                    'category': self.categorize_product(row.get('Category', row.get('category', ''))),
                    'cost_price': self.parse_price(row.get('Price', row.get('price', row.get('Cost', '0')))),
                    'stock_quantity': self.parse_int(row.get('Stock', row.get('stock', row.get('Quantity', '0')))),
                    'image_url': row.get('Image', row.get('image', row.get('Image URL', ''))),
                    'supplier': 'Bike It'
                }
                
                # Skip products without essential data
                if not product_data['sku'] or not product_data['name']:
                    continue
                
                # Calculate selling price
                product_data['selling_price'] = (product_data['cost_price'] * 1.5) + 6.0
                product_data['delivery_cost'] = 6.0
                
                # Set stock status
                product_data['in_stock'] = product_data['stock_quantity'] > 0
                
                products.append(product_data)
            
            logger.info(f"Parsed {len(products)} products from CSV")
            return products
            
        except Exception as e:
            logger.error(f"Failed to parse CSV content: {e}")
            raise
    
    def categorize_product(self, category_hint):
        """Categorize products based on name and description"""
        if not category_hint:
            return 'Uncategorized'
        
        category_hint = category_hint.lower()
        
        # Define category mappings
        category_map = {
            'brake': 'Brakes & ABS',
            'suspension': 'Suspension & Steering',
            'shock': 'Suspension & Steering',
            'steering': 'Suspension & Steering',
            'electrical': 'Electrical & Lighting',
            'lighting': 'Electrical & Lighting',
            'light': 'Electrical & Lighting',
            'bulb': 'Electrical & Lighting',
            'engine': 'Engine & Performance',
            'performance': 'Engine & Performance',
            'exhaust': 'Engine & Performance',
            'transmission': 'Transmission & Clutch',
            'clutch': 'Transmission & Clutch',
            'chain': 'Transmission & Clutch',
            'sprocket': 'Transmission & Clutch',
            'wheel': 'Wheels & Tyres',
            'tyre': 'Wheels & Tyres',
            'tire': 'Wheels & Tyres',
            'rim': 'Wheels & Tyres',
            'body': 'Body & Fairings',
            'fairing': 'Body & Fairings',
            'panel': 'Body & Fairings',
            'cooling': 'Cooling & Lubrication',
            'radiator': 'Cooling & Lubrication',
            'oil': 'Cooling & Lubrication',
            'fuel': 'Fuel & Air',
            'air': 'Fuel & Air',
            'filter': 'Fuel & Air',
            'battery': 'Batteries & Charging',
            'charging': 'Batteries & Charging',
            'tool': 'Tools & Maintenance',
            'maintenance': 'Tools & Maintenance',
            'security': 'Security & Locks',
            'lock': 'Security & Locks',
            'luggage': 'Luggage & Storage',
            'storage': 'Luggage & Storage',
            'bag': 'Luggage & Storage',
            'clothing': 'Clothing & Protection',
            'protection': 'Clothing & Protection',
            'helmet': 'Clothing & Protection',
            'glove': 'Clothing & Protection',
            'cover': 'Covers & Accessories',
            'accessory': 'Covers & Accessories'
        }
        
        # Find matching category
        for keyword, category in category_map.items():
            if keyword in category_hint:
                return category
        
        return 'Uncategorized'
    
    def parse_price(self, price_str):
        """Parse price string to float"""
        try:
            # Remove currency symbols and whitespace
            price_str = str(price_str).replace('£', '').replace('$', '').replace(',', '').strip()
            return float(price_str) if price_str else 0.0
        except:
            return 0.0
    
    def parse_int(self, int_str):
        """Parse integer string to int"""
        try:
            return int(float(str(int_str).strip())) if int_str else 0
        except:
            return 0
    
    def update_database(self, products):
        """Update Supabase database with new product data"""
        try:
            # Use upsert to insert or update products
            result = supabase_service.upsert_products(products)
            
            if result['success']:
                logger.info(f"Database updated: {result['count']} products processed")
                return {
                    'created_or_updated': result['count'],
                    'total': len(products)
                }
            else:
                logger.error(f"Failed to update database: {result['error']}")
                raise Exception(result['error'])
            
        except Exception as e:
            logger.error(f"Failed to update database: {e}")
            raise

def sync_bikeit_products():
    """Main function to sync products from Bike It FTP"""
    try:
        logger.info("Starting Bike It product synchronization with Supabase")
        
        # Initialize FTP sync
        ftp_sync = BikeItFTPSyncSupabase()
        
        # Connect to FTP server
        ssh, sftp = ftp_sync.connect_ftp()
        
        try:
            # Download product feed
            csv_content = ftp_sync.download_product_feed(sftp)
            
            if not csv_content:
                return {'error': 'No product feed found'}
            
            # Parse CSV content
            products = ftp_sync.parse_csv_content(csv_content)
            
            # Update database
            result = ftp_sync.update_database(products)
            
            logger.info("Product synchronization completed successfully")
            return result
            
        finally:
            # Close connections
            sftp.close()
            ssh.close()
            
    except Exception as e:
        logger.error(f"Product synchronization failed: {e}")
        return {'error': str(e)}

if __name__ == '__main__':
    # For testing purposes
    result = sync_bikeit_products()
    print(f"Sync result: {result}")

