from flask import Blueprint, request, jsonify
from src.models.product import db, Product, Order, OrderItem
from sqlalchemy import or_
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
        
        # Build query
        query = Product.query
        
        # Apply search filter
        if search:
            query = query.filter(
                or_(
                    Product.name.ilike(f'%{search}%'),
                    Product.description.ilike(f'%{search}%'),
                    Product.category.ilike(f'%{search}%'),
                    Product.sku.ilike(f'%{search}%')
                )
            )
        
        # Apply category filter
        if category:
            query = query.filter(Product.category.ilike(f'%{category}%'))
        
        # Paginate results
        products = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'products': [product.to_dict() for product in products.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': products.total,
                'pages': products.pages,
                'has_next': products.has_next,
                'has_prev': products.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID"""
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify({
            'success': True,
            'product': product.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/products/categories', methods=['GET'])
def get_categories():
    """Get all unique product categories"""
    try:
        categories = db.session.query(Product.category).distinct().filter(Product.category.isnot(None)).all()
        category_list = [cat[0] for cat in categories if cat[0]]
        
        return jsonify({
            'success': True,
            'categories': sorted(category_list)
        })
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
        selling_price = Product.calculate_selling_price(cost_price, delivery_cost)
        
        product = Product(
            sku=data.get('sku'),
            name=data.get('name'),
            description=data.get('description', ''),
            category=data.get('category', ''),
            cost_price=cost_price,
            selling_price=selling_price,
            delivery_cost=delivery_cost,
            stock_quantity=int(data.get('stock_quantity', 0)),
            in_stock=bool(data.get('in_stock', True)),
            image_url=data.get('image_url', ''),
            supplier=data.get('supplier', 'Bike It')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product (for admin use)"""
    try:
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'category' in data:
            product.category = data['category']
        if 'cost_price' in data:
            product.cost_price = float(data['cost_price'])
            # Recalculate selling price
            product.selling_price = Product.calculate_selling_price(
                product.cost_price, 
                product.delivery_cost
            )
        if 'delivery_cost' in data:
            product.delivery_cost = float(data['delivery_cost'])
            # Recalculate selling price
            product.selling_price = Product.calculate_selling_price(
                product.cost_price, 
                product.delivery_cost
            )
        if 'stock_quantity' in data:
            product.stock_quantity = int(data['stock_quantity'])
        if 'in_stock' in data:
            product.in_stock = bool(data['in_stock'])
        if 'image_url' in data:
            product.image_url = data['image_url']
        if 'supplier' in data:
            product.supplier = data['supplier']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'product': product.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product (for admin use)"""
    try:
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/sync-products', methods=['POST'])
def sync_products():
    """Trigger product synchronization from FTP feed"""
    try:
        # This will be implemented in the FTP sync module
        from src.services.ftp_sync import sync_bikeit_products
        
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

