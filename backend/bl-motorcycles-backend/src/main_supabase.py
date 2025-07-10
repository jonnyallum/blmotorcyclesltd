import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import Supabase service and routes
from src.services.supabase_client import supabase_service
from src.routes.user import user_bp
from src.routes.products_supabase import products_bp
from src.routes.orders_supabase import orders_bp
from src.routes.webhooks import webhooks_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Enable CORS for all routes
CORS(app, origins="*")

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(products_bp, url_prefix='/api')
app.register_blueprint(orders_bp, url_prefix='/api')
app.register_blueprint(webhooks_bp, url_prefix='/api')

# Initialize Supabase tables
# try:
#     supabase_service.create_tables()
# except Exception as e:
#     print(f"Warning: Could not create Supabase tables: {e}")

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'B&L Motorcycles Backend',
        'version': '1.0.0',
        'database': 'Supabase'
    })

# API info endpoint
@app.route('/api/info', methods=['GET'])
def api_info():
    """API information endpoint"""
    return jsonify({
        'service': 'B&L Motorcycles Backend API',
        'version': '1.0.0',
        'database': 'Supabase PostgreSQL',
        'endpoints': {
            'products': '/api/products',
            'orders': '/api/orders',
            'health': '/api/health',
            'sync': '/api/sync-products',
            'stripe_config': '/api/stripe-config',
            'checkout': '/api/create-checkout-session',
            'stripe_webhook': '/api/webhook/stripe',
            'ebay_webhook': '/api/webhook/ebay',
            'facebook_webhook': '/api/webhook/facebook',
            'instagram_webhook': '/api/webhook/instagram',
            'test_webhook': '/api/webhook/test'
        },
        'features': [
            'Product management with Supabase',
            'Order processing',
            'Stripe integration',
            'FTP synchronization',
            'Dropshipping automation',
            'Real-time database updates'
        ]
    })

# Test endpoint to add sample products
@app.route('/api/test/add-sample-products', methods=['POST'])
def add_sample_products():
    """Add sample products for testing"""
    try:
        sample_products = [
            {
                'sku': 'BRK001',
                'name': 'Brake Pads - Front',
                'description': 'High-quality front brake pads for motorcycles',
                'category': 'Brakes & ABS',
                'cost_price': 30.66,
                'selling_price': 52.0,  # (30.66 * 1.5) + 6
                'delivery_cost': 6.0,
                'stock_quantity': 25,
                'in_stock': True,
                'image_url': '',
                'supplier': 'Bike It'
            },
            {
                'sku': 'CHN001',
                'name': 'Chain & Sprocket Kit',
                'description': 'Complete chain and sprocket kit for motorcycles',
                'category': 'Transmission & Clutch',
                'cost_price': 59.99,
                'selling_price': 95.99,  # (59.99 * 1.5) + 6
                'delivery_cost': 6.0,
                'stock_quantity': 15,
                'in_stock': True,
                'image_url': '',
                'supplier': 'Bike It'
            },
            {
                'sku': 'OIL001',
                'name': 'Oil Filter',
                'description': 'Premium oil filter for motorcycle engines',
                'category': 'Engine & Performance',
                'cost_price': 12.66,
                'selling_price': 24.99,  # (12.66 * 1.5) + 6
                'delivery_cost': 6.0,
                'stock_quantity': 0,
                'in_stock': False,
                'image_url': '',
                'supplier': 'Bike It'
            }
        ]
        
        result = supabase_service.upsert_products(sample_products)
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': f'Added {result["count"]} sample products',
                'products': sample_products
            })
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Serve frontend files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return jsonify({
                'message': 'B&L Motorcycles Backend API',
                'status': 'running',
                'database': 'Supabase',
                'frontend': 'not deployed',
                'api_docs': '/api/info'
            })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Not found',
        'message': 'The requested resource was not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

