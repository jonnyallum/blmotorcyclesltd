import smtplib
import os
from email.message import EmailMessage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import logging
from datetime import datetime

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DropshippingService:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"  # or appropriate SMTP server
        self.smtp_port = 587
        self.email_from = os.getenv('EMAIL', 'brett@blmotorcyclesltd.co.uk')
        self.email_password = os.getenv('EMAIL_PASSWORD', '')  # App password for Gmail
        self.bikeit_email = "sales@bikeit.co.uk"  # Bike It sales email
        
    def send_bikeit_order(self, order):
        """Send order details to Bike It for dropshipping"""
        try:
            logger.info(f"Sending order {order.order_id} to Bike It")
            
            # Prepare email content
            subject = f"New Order from B&L Motorcycles – {order.order_id}"
            
            # Create email body
            email_body = self.create_order_email_body(order)
            
            # Send email
            self.send_email(
                to_email=self.bikeit_email,
                subject=subject,
                body=email_body,
                cc_email=self.email_from  # CC to B&L for record keeping
            )
            
            logger.info(f"Order {order.order_id} sent to Bike It successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send order {order.order_id} to Bike It: {e}")
            return False
    
    def create_order_email_body(self, order):
        """Create formatted email body for Bike It order"""
        
        # Get order items
        items_text = ""
        for item in order.items:
            items_text += f"""
Product: {item.product.name}
SKU: {item.product.sku}
Quantity: {item.quantity}
Unit Price: £{item.unit_price:.2f}
Total: £{item.total_price:.2f}

"""
        
        email_body = f"""
Dear Bike It Sales Team,

Please process the following order for direct dispatch to our customer:

ORDER DETAILS:
Order ID: {order.order_id}
Order Date: {order.created_at.strftime('%d/%m/%Y %H:%M')}
Total Amount: £{order.total_amount:.2f}

CUSTOMER DETAILS:
Name: {order.customer_name}
Email: {order.customer_email}
Phone: {order.customer_phone}

DELIVERY ADDRESS:
{order.customer_name}
{order.address_line_1}
{order.address_line_2 + chr(10) if order.address_line_2 else ''}{order.city}
{order.postcode}
{order.country}

ITEMS ORDERED:
{items_text}

SPECIAL INSTRUCTIONS:
- Please mark for direct dispatch to customer
- Include B&L Motorcycles branding if possible
- Send tracking information to: {self.email_from}
- Customer has already paid via our website

Please confirm receipt of this order and provide estimated dispatch time.

Best regards,
B&L Motorcycles Ltd
Company No: {os.getenv('COMPANY_NO', '14122962')}
Email: {self.email_from}
Phone: {os.getenv('PHONE', '07881274193')}

---
This is an automated message from the B&L Motorcycles ordering system.
"""
        
        return email_body
    
    def send_email(self, to_email, subject, body, cc_email=None):
        """Send email using SMTP"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email_from
            msg['To'] = to_email
            msg['Subject'] = subject
            
            if cc_email:
                msg['Cc'] = cc_email
            
            # Add body to email
            msg.attach(MIMEText(body, 'plain'))
            
            # Create SMTP session
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()  # Enable security
            
            # Login with sender's email and password
            if self.email_password:
                server.login(self.email_from, self.email_password)
            
            # Send email
            recipients = [to_email]
            if cc_email:
                recipients.append(cc_email)
            
            text = msg.as_string()
            server.sendmail(self.email_from, recipients, text)
            server.quit()
            
            logger.info(f"Email sent successfully to {to_email}")
            
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            raise
    
    def send_order_confirmation(self, order):
        """Send order confirmation to customer"""
        try:
            logger.info(f"Sending order confirmation to {order.customer_email}")
            
            subject = f"Order Confirmation - {order.order_id} - B&L Motorcycles"
            
            # Create customer email body
            email_body = self.create_customer_confirmation_email(order)
            
            # Send email to customer
            self.send_email(
                to_email=order.customer_email,
                subject=subject,
                body=email_body
            )
            
            logger.info(f"Order confirmation sent to {order.customer_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send order confirmation: {e}")
            return False
    
    def create_customer_confirmation_email(self, order):
        """Create order confirmation email for customer"""
        
        # Get order items
        items_text = ""
        for item in order.items:
            items_text += f"""
{item.product.name} (SKU: {item.product.sku})
Quantity: {item.quantity}
Price: £{item.unit_price:.2f} each
Subtotal: £{item.total_price:.2f}

"""
        
        email_body = f"""
Dear {order.customer_name},

Thank you for your order with B&L Motorcycles!

ORDER CONFIRMATION:
Order Number: {order.order_id}
Order Date: {order.created_at.strftime('%d/%m/%Y %H:%M')}
Total Amount: £{order.total_amount:.2f}

DELIVERY ADDRESS:
{order.customer_name}
{order.address_line_1}
{order.address_line_2 + chr(10) if order.address_line_2 else ''}{order.city}
{order.postcode}
{order.country}

ITEMS ORDERED:
{items_text}

WHAT HAPPENS NEXT:
1. Your order is being processed by our team
2. Items will be dispatched within 1-3 business days
3. You will receive tracking information via email
4. Delivery typically takes 2-5 business days

If you have any questions about your order, please contact us:
Email: {self.email_from}
Phone: {os.getenv('PHONE', '07881274193')}

Thank you for choosing B&L Motorcycles!

Best regards,
The B&L Motorcycles Team

---
B&L Motorcycles Ltd
Company No: {os.getenv('COMPANY_NO', '14122962')}
Website: {os.getenv('WEBSITE_URL', 'https://blmotorcycles.com')}
"""
        
        return email_body

# Global instance for easy import
dropshipping_service = DropshippingService()

def send_bikeit_order(order):
    """Convenience function to send order to Bike It"""
    return dropshipping_service.send_bikeit_order(order)

def send_order_confirmation(order):
    """Convenience function to send order confirmation to customer"""
    return dropshipping_service.send_order_confirmation(order)

