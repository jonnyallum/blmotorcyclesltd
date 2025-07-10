from flask import Blueprint, request, jsonify
from src.services.supabase_client import supabase_service
import os
from dotenv import load_dotenv

load_dotenv()

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    """Get all products with optional search and category filtering"""
    try:
        # Get query parameters
        search = request.args.get('search', '')
        category = request.args.get('category', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Get products from Supabase
        result = supabase_service.get_products(
            search=search if search else None,
            category=category if category else None,
            page=page,
            per_page=per_page
        )
        
        if result['success']:
            return jsonify({
                'success': True,
                'products': result['products'],
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': result['count'],
                    'has_next': len(result['products']) == per_page,
                    'has_prev': page > 1
                }
            })
        else:
            return jsonify(result), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID"""
    try:
        result = supabase_service.get_product_by_id(product_id)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 404 if 'not found' in result.get('error', '').lower() else 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/products/categories', methods=['GET'])
def get_categories():
    """Get all unique product categories"""
    try:
        result = supabase_service.get_categories()
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/products', methods=['POST'])
def create_product():
    """Create a new product (for admin use)"""
    try:
        data = request.get_json()
        
        # Calculate selling price
        cost_price = float(data.get('cost_price', 0))
        delivery_cost = float(data.get('delivery_cost', 6.0))
        selling_price = (cost_price * 1.5) + delivery_cost
        
        product_data = {
            'sku': data.get('sku'),
            'name': data.get('name'),
            'description': data.get('description', ''),
            'category': data.get('category', ''),
            'cost_price': cost_price,
            'selling_price': selling_price,
            'delivery_cost': delivery_cost,
            'stock_quantity': int(data.get('stock_quantity', 0)),
            'in_stock': bool(data.get('in_stock', True)),
            'image_url': data.get('image_url', ''),
            'supplier': data.get('supplier', 'Bike It')
        }
        
        result = supabase_service.create_product(product_data)
        
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product (for admin use)"""
    try:
        data = request.get_json()
        
        # Prepare update data
        update_data = {}
        
        if 'name' in data:
            update_data['name'] = data['name']
        if 'description' in data:
            update_data['description'] = data['description']
        if 'category' in data:
            update_data['category'] = data['category']
        if 'cost_price' in data:
            cost_price = float(data['cost_price'])
            update_data['cost_price'] = cost_price
            # Recalculate selling price
            delivery_cost = float(data.get('delivery_cost', 6.0))
            update_data['selling_price'] = (cost_price * 1.5) + delivery_cost
        if 'delivery_cost' in data:
            delivery_cost = float(data['delivery_cost'])
            update_data['delivery_cost'] = delivery_cost
            # Recalculate selling price if cost_price is available
            if 'cost_price' in data:
                cost_price = float(data['cost_price'])
                update_data['selling_price'] = (cost_price * 1.5) + delivery_cost
        if 'stock_quantity' in data:
            update_data['stock_quantity'] = int(data['stock_quantity'])
        if 'in_stock' in data:
            update_data['in_stock'] = bool(data['in_stock'])
        if 'image_url' in data:
            update_data['image_url'] = data['image_url']
        if 'supplier' in data:
            update_data['supplier'] = data['supplier']
        
        update_data['updated_at'] = 'NOW()'
        
        result = supabase_service.update_product(product_id, update_data)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product (for admin use)"""
    try:
        result = supabase_service.delete_product(product_id)
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Product deleted successfully'
            })
        else:
            return jsonify(result), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/sync-products', methods=['POST'])
def sync_products():
    """Trigger product synchronization from FTP feed"""
    try:
        # Import the sync function
        from src.services.ftp_sync_supabase import sync_bikeit_products
        
        result = sync_bikeit_products()
        
        return jsonify({
            'success': True,
            'message': 'Product synchronization completed',
            'result': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

