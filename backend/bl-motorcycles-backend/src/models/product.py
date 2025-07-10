from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    cost_price = db.Column(db.Float, nullable=False)  # Original cost from supplier
    selling_price = db.Column(db.Float, nullable=False)  # cost * 1.5 + 6
    delivery_cost = db.Column(db.Float, default=6.0)
    stock_quantity = db.Column(db.Integer, default=0)
    in_stock = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(500))
    supplier = db.Column(db.String(100), default='Bike It')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Product {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'sku': self.sku,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'cost_price': self.cost_price,
            'selling_price': self.selling_price,
            'delivery_cost': self.delivery_cost,
            'stock_quantity': self.stock_quantity,
            'in_stock': self.in_stock,
            'image_url': self.image_url,
            'supplier': self.supplier,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @staticmethod
    def calculate_selling_price(cost_price, delivery_cost=6.0):
        """Calculate selling price using the formula: cost * 1.5 + delivery"""
        return (cost_price * 1.5) + delivery_cost

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(100), unique=True, nullable=False)
    stripe_session_id = db.Column(db.String(200))
    customer_name = db.Column(db.String(255), nullable=False)
    customer_email = db.Column(db.String(255), nullable=False)
    customer_phone = db.Column(db.String(50))
    address_line_1 = db.Column(db.String(255), nullable=False)
    address_line_2 = db.Column(db.String(255))
    city = db.Column(db.String(100), nullable=False)
    postcode = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    order_status = db.Column(db.String(50), default='pending')  # pending, paid, processing, shipped, delivered
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to order items
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Order {self.order_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'stripe_session_id': self.stripe_session_id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'address_line_1': self.address_line_1,
            'address_line_2': self.address_line_2,
            'city': self.city,
            'postcode': self.postcode,
            'country': self.country,
            'total_amount': self.total_amount,
            'order_status': self.order_status,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    
    # Relationships
    product = db.relationship('Product', backref='order_items')
    
    def __repr__(self):
        return f'<OrderItem {self.product.name} x{self.quantity}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'product_sku': self.product.sku if self.product else None,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total_price': self.total_price
        }

