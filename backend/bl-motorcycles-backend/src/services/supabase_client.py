import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
        self.key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')  # Use service role for backend
        
        if not self.url or not self.key:
            raise ValueError("Supabase URL and Service Role Key must be set in environment variables")
        
        self.client: Client = create_client(self.url, self.key)
        logger.info("Supabase client initialized successfully")
    
    def get_client(self) -> Client:
        """Get the Supabase client instance"""
        return self.client
    
    def create_tables(self):
        """Create database tables if they don't exist"""
        try:
            # Create products table
            products_sql = """
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                sku VARCHAR(100) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                cost_price DECIMAL(10,2) NOT NULL,
                selling_price DECIMAL(10,2) NOT NULL,
                delivery_cost DECIMAL(10,2) DEFAULT 6.0,
                stock_quantity INTEGER DEFAULT 0,
                in_stock BOOLEAN DEFAULT true,
                image_url VARCHAR(500),
                supplier VARCHAR(100) DEFAULT 'Bike It',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """
            
            # Create orders table
            orders_sql = """
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(100) UNIQUE NOT NULL,
                stripe_session_id VARCHAR(200),
                customer_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255) NOT NULL,
                customer_phone VARCHAR(50),
                address_line_1 VARCHAR(255) NOT NULL,
                address_line_2 VARCHAR(255),
                city VARCHAR(100) NOT NULL,
                postcode VARCHAR(20) NOT NULL,
                country VARCHAR(100) NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                order_status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """
            
            # Create order_items table
            order_items_sql = """
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER NOT NULL,
                unit_price DECIMAL(10,2) NOT NULL,
                total_price DECIMAL(10,2) NOT NULL
            );
            """
            
            # Execute SQL commands
            self.client.rpc('exec_sql', {'sql': products_sql}).execute()
            self.client.rpc('exec_sql', {'sql': orders_sql}).execute()
            self.client.rpc('exec_sql', {'sql': order_items_sql}).execute()
            
            logger.info("Database tables created successfully")
            
        except Exception as e:
            logger.error(f"Failed to create tables: {e}")
            # Tables might already exist, which is fine
            pass
    
    # Product operations
    def get_products(self, search=None, category=None, page=1, per_page=20):
        """Get products with optional filtering and pagination"""
        try:
            query = self.client.table('products').select('*')
            
            # Apply search filter
            if search:
                query = query.or_(f'name.ilike.%{search}%,description.ilike.%{search}%,category.ilike.%{search}%,sku.ilike.%{search}%')
            
            # Apply category filter
            if category:
                query = query.ilike('category', f'%{category}%')
            
            # Apply pagination
            start = (page - 1) * per_page
            end = start + per_page - 1
            
            result = query.range(start, end).execute()
            
            return {
                'success': True,
                'products': result.data,
                'count': len(result.data)
            }
            
        except Exception as e:
            logger.error(f"Failed to get products: {e}")
            return {'success': False, 'error': str(e)}
    
    def get_product_by_id(self, product_id):
        """Get a single product by ID"""
        try:
            result = self.client.table('products').select('*').eq('id', product_id).execute()
            
            if result.data:
                return {'success': True, 'product': result.data[0]}
            else:
                return {'success': False, 'error': 'Product not found'}
                
        except Exception as e:
            logger.error(f"Failed to get product: {e}")
            return {'success': False, 'error': str(e)}
    
    def create_product(self, product_data):
        """Create a new product"""
        try:
            result = self.client.table('products').insert(product_data).execute()
            
            return {
                'success': True,
                'product': result.data[0] if result.data else None
            }
            
        except Exception as e:
            logger.error(f"Failed to create product: {e}")
            return {'success': False, 'error': str(e)}
    
    def update_product(self, product_id, product_data):
        """Update a product"""
        try:
            result = self.client.table('products').update(product_data).eq('id', product_id).execute()
            
            return {
                'success': True,
                'product': result.data[0] if result.data else None
            }
            
        except Exception as e:
            logger.error(f"Failed to update product: {e}")
            return {'success': False, 'error': str(e)}
    
    def delete_product(self, product_id):
        """Delete a product"""
        try:
            result = self.client.table('products').delete().eq('id', product_id).execute()
            
            return {'success': True}
            
        except Exception as e:
            logger.error(f"Failed to delete product: {e}")
            return {'success': False, 'error': str(e)}
    
    def upsert_products(self, products_data):
        """Upsert multiple products (insert or update)"""
        try:
            result = self.client.table('products').upsert(products_data, on_conflict='sku').execute()
            
            return {
                'success': True,
                'count': len(result.data) if result.data else 0
            }
            
        except Exception as e:
            logger.error(f"Failed to upsert products: {e}")
            return {'success': False, 'error': str(e)}
    
    # Order operations
    def create_order(self, order_data):
        """Create a new order"""
        try:
            result = self.client.table('orders').insert(order_data).execute()
            
            return {
                'success': True,
                'order': result.data[0] if result.data else None
            }
            
        except Exception as e:
            logger.error(f"Failed to create order: {e}")
            return {'success': False, 'error': str(e)}
    
    def get_orders(self, status=None, page=1, per_page=20):
        """Get orders with optional filtering"""
        try:
            query = self.client.table('orders').select('*')
            
            if status:
                query = query.eq('order_status', status)
            
            # Apply pagination
            start = (page - 1) * per_page
            end = start + per_page - 1
            
            result = query.order('created_at', desc=True).range(start, end).execute()
            
            return {
                'success': True,
                'orders': result.data,
                'count': len(result.data)
            }
            
        except Exception as e:
            logger.error(f"Failed to get orders: {e}")
            return {'success': False, 'error': str(e)}
    
    def get_order_by_id(self, order_id):
        """Get a single order by ID"""
        try:
            result = self.client.table('orders').select('*').eq('id', order_id).execute()
            
            if result.data:
                return {'success': True, 'order': result.data[0]}
            else:
                return {'success': False, 'error': 'Order not found'}
                
        except Exception as e:
            logger.error(f"Failed to get order: {e}")
            return {'success': False, 'error': str(e)}
    
    def update_order_status(self, order_id, status):
        """Update order status"""
        try:
            result = self.client.table('orders').update({
                'order_status': status,
                'updated_at': 'NOW()'
            }).eq('id', order_id).execute()
            
            return {
                'success': True,
                'order': result.data[0] if result.data else None
            }
            
        except Exception as e:
            logger.error(f"Failed to update order status: {e}")
            return {'success': False, 'error': str(e)}
    
    def create_order_item(self, order_item_data):
        """Create an order item"""
        try:
            result = self.client.table('order_items').insert(order_item_data).execute()
            
            return {
                'success': True,
                'order_item': result.data[0] if result.data else None
            }
            
        except Exception as e:
            logger.error(f"Failed to create order item: {e}")
            return {'success': False, 'error': str(e)}
    
    def get_categories(self):
        """Get all unique product categories"""
        try:
            result = self.client.table('products').select('category').execute()
            
            categories = list(set([item['category'] for item in result.data if item['category']]))
            categories.sort()
            
            return {
                'success': True,
                'categories': categories
            }
            
        except Exception as e:
            logger.error(f"Failed to get categories: {e}")
            return {'success': False, 'error': str(e)}

# Global instance
supabase_service = SupabaseService()

