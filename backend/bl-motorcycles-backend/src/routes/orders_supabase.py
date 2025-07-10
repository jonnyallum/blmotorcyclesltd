from flask import Blueprint, request, jsonify
from src.services.supabase_client import supabase_service
import stripe
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime

load_dotenv()

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    """Get all orders with optional filtering"""
    try:
        # Get query parameters
        status = request.args.get('status', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Get orders from Supabase
        result = supabase_service.get_orders(
            status=status if status else None,
            page=page,
            per_page=per_page
        )
        
        if result['success']:
            return jsonify({
                'success': True,
                'orders': result['orders'],
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': result['count'],
                    'has_next': len(result['orders']) == per_page,
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

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get a single order by ID"""
    try:
        result = supabase_service.get_order_by_id(order_id)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 404 if 'not found' in result.get('error', '').lower() else 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orders_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    """Create a Stripe checkout session"""
    try:
        data = request.get_json()
        items = data.get('items', [])
        customer_info = data.get('customer_info', {})
        
        if not items:
            return jsonify({
                'success': False,
                'error': 'No items provided'
            }), 400
        
        # Calculate total and prepare line items for Stripe
        line_items = []
        total_amount = 0
        
        for item in items:
            # Get product from Supabase
            product_result = supabase_service.get_product_by_id(item['product_id'])
            
            if not product_result['success']:
                return jsonify({
                    'success': False,
                    'error': f'Product with ID {item["product_id"]} not found'
                }), 404
            
            product = product_result['product']
            quantity = int(item['quantity'])
            unit_price = int(float(product['selling_price']) * 100)  # Convert to cents
            total_amount += float(product['selling_price']) * quantity
            
            line_items.append({
                'price_data': {
                    'currency': 'gbp',
                    'product_data': {
                        'name': product['name'],
                        'description': f'SKU: {product["sku"]}',
                    },
                    'unit_amount': unit_price,
                },
                'quantity': quantity,
            })
        
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=request.host_url + 'success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=request.host_url + 'cancel',
            customer_email=customer_info.get('email'),
            billing_address_collection='required',
            shipping_address_collection={
                'allowed_countries': ['GB', 'US', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE'],
            },
            metadata={
                'customer_name': customer_info.get('name', ''),
                'customer_phone': customer_info.get('phone', ''),
                'items': str(items)  # Store items for webhook processing
            }
        )
        
        return jsonify({
            'success': True,
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orders_bp.route('/webhook/stripe', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events"""
    try:
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
        
        if endpoint_secret:
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, endpoint_secret
                )
            except ValueError:
                return jsonify({'error': 'Invalid payload'}), 400
            except stripe.error.SignatureVerificationError:
                return jsonify({'error': 'Invalid signature'}), 400
        else:
            event = stripe.Event.construct_from(
                request.get_json(), stripe.api_key
            )
        
        # Handle the checkout.session.completed event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            
            # Create order in Supabase
            order_id = str(uuid.uuid4())[:8].upper()
            
            # Extract customer information
            customer_details = session.get('customer_details', {})
            shipping_details = session.get('shipping_details', {})
            
            order_data = {
                'order_id': order_id,
                'stripe_session_id': session['id'],
                'customer_name': customer_details.get('name', session.get('metadata', {}).get('customer_name', '')),
                'customer_email': customer_details.get('email', ''),
                'customer_phone': session.get('metadata', {}).get('customer_phone', ''),
                'address_line_1': shipping_details.get('address', {}).get('line1', ''),
                'address_line_2': shipping_details.get('address', {}).get('line2', ''),
                'city': shipping_details.get('address', {}).get('city', ''),
                'postcode': shipping_details.get('address', {}).get('postal_code', ''),
                'country': shipping_details.get('address', {}).get('country', ''),
                'total_amount': session['amount_total'] / 100,  # Convert from cents
                'order_status': 'paid'
            }
            
            # Create order in Supabase
            order_result = supabase_service.create_order(order_data)
            
            if order_result['success']:
                order = order_result['order']
                
                # Add order items
                items_str = session.get('metadata', {}).get('items', '[]')
                try:
                    import ast
                    items = ast.literal_eval(items_str)
                    
                    for item in items:
                        product_result = supabase_service.get_product_by_id(item['product_id'])
                        if product_result['success']:
                            product = product_result['product']
                            order_item_data = {
                                'order_id': order['id'],
                                'product_id': product['id'],
                                'quantity': int(item['quantity']),
                                'unit_price': float(product['selling_price']),
                                'total_price': float(product['selling_price']) * int(item['quantity'])
                            }
                            supabase_service.create_order_item(order_item_data)
                except:
                    pass  # If items parsing fails, continue without items
                
                # Trigger dropshipping automation
                try:
                    from src.services.dropshipping import send_bikeit_order
                    # Create a mock order object for the dropshipping service
                    class MockOrder:
                        def __init__(self, order_data):
                            for key, value in order_data.items():
                                setattr(self, key, value)
                            self.items = []  # Will be populated if needed
                    
                    mock_order = MockOrder(order)
                    send_bikeit_order(mock_order)
                except Exception as e:
                    print(f"Dropshipping automation failed: {e}")
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orders_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status"""
    try:
        data = request.get_json()
        
        new_status = data.get('status')
        if new_status not in ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']:
            return jsonify({
                'success': False,
                'error': 'Invalid status'
            }), 400
        
        result = supabase_service.update_order_status(order_id, new_status)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orders_bp.route('/stripe-config', methods=['GET'])
def get_stripe_config():
    """Get Stripe publishable key for frontend"""
    return jsonify({
        'success': True,
        'publishable_key': os.getenv('STRIPE_PUBLISHABLE_KEY')
    })

