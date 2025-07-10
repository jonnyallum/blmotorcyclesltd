import logging
import os
from datetime import datetime
from logging.handlers import RotatingFileHandler
import json

class BLMotorcyclesLogger:
    """Centralized logging service for B&L Motorcycles application"""
    
    def __init__(self, log_dir='/var/log/bl_motorcycles'):
        self.log_dir = log_dir
        self.ensure_log_directory()
        self.setup_loggers()
    
    def ensure_log_directory(self):
        """Create log directory if it doesn't exist"""
        try:
            os.makedirs(self.log_dir, exist_ok=True)
            # Make sure the directory is writable
            os.chmod(self.log_dir, 0o755)
        except Exception as e:
            # Fallback to local directory if system log directory is not accessible
            self.log_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')
            os.makedirs(self.log_dir, exist_ok=True)
    
    def setup_loggers(self):
        """Set up different loggers for different components"""
        
        # Main application logger
        self.app_logger = self.create_logger(
            'bl_motorcycles_app',
            os.path.join(self.log_dir, 'app.log')
        )
        
        # FTP sync logger
        self.ftp_logger = self.create_logger(
            'bl_motorcycles_ftp',
            os.path.join(self.log_dir, 'ftp_sync.log')
        )
        
        # Webhook logger
        self.webhook_logger = self.create_logger(
            'bl_motorcycles_webhooks',
            os.path.join(self.log_dir, 'webhooks.log')
        )
        
        # Order processing logger
        self.order_logger = self.create_logger(
            'bl_motorcycles_orders',
            os.path.join(self.log_dir, 'orders.log')
        )
        
        # Error logger
        self.error_logger = self.create_logger(
            'bl_motorcycles_errors',
            os.path.join(self.log_dir, 'errors.log'),
            level=logging.ERROR
        )
    
    def create_logger(self, name, log_file, level=logging.INFO, max_bytes=10*1024*1024, backup_count=5):
        """Create a logger with rotating file handler"""
        
        logger = logging.getLogger(name)
        logger.setLevel(level)
        
        # Remove existing handlers to avoid duplicates
        for handler in logger.handlers[:]:
            logger.removeHandler(handler)
        
        # Create formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        # File handler with rotation
        try:
            file_handler = RotatingFileHandler(
                log_file, 
                maxBytes=max_bytes, 
                backupCount=backup_count
            )
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
        except Exception as e:
            print(f"Warning: Could not create file handler for {log_file}: {e}")
        
        # Console handler for development
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
        
        return logger
    
    def log_ftp_sync_start(self, sync_type='manual'):
        """Log FTP sync start"""
        self.ftp_logger.info(f"FTP sync started - Type: {sync_type}")
    
    def log_ftp_sync_success(self, result):
        """Log successful FTP sync"""
        self.ftp_logger.info(f"FTP sync completed successfully: {result}")
    
    def log_ftp_sync_error(self, error):
        """Log FTP sync error"""
        self.ftp_logger.error(f"FTP sync failed: {error}")
        self.error_logger.error(f"FTP sync error: {error}")
    
    def log_webhook_received(self, webhook_type, data):
        """Log webhook received"""
        self.webhook_logger.info(f"Webhook received - Type: {webhook_type}")
        self.webhook_logger.debug(f"Webhook data: {json.dumps(data, default=str)}")
    
    def log_webhook_processed(self, webhook_type, result):
        """Log webhook processing result"""
        self.webhook_logger.info(f"Webhook processed - Type: {webhook_type}, Result: {result}")
    
    def log_webhook_error(self, webhook_type, error):
        """Log webhook processing error"""
        self.webhook_logger.error(f"Webhook processing failed - Type: {webhook_type}, Error: {error}")
        self.error_logger.error(f"Webhook error ({webhook_type}): {error}")
    
    def log_order_created(self, order_id, amount):
        """Log order creation"""
        self.order_logger.info(f"Order created - ID: {order_id}, Amount: £{amount}")
    
    def log_order_status_change(self, order_id, old_status, new_status):
        """Log order status change"""
        self.order_logger.info(f"Order status changed - ID: {order_id}, {old_status} -> {new_status}")
    
    def log_dropshipping_sent(self, order_id, supplier):
        """Log dropshipping order sent"""
        self.order_logger.info(f"Dropshipping order sent - Order: {order_id}, Supplier: {supplier}")
    
    def log_dropshipping_error(self, order_id, error):
        """Log dropshipping error"""
        self.order_logger.error(f"Dropshipping failed - Order: {order_id}, Error: {error}")
        self.error_logger.error(f"Dropshipping error (Order {order_id}): {error}")
    
    def log_app_start(self):
        """Log application start"""
        self.app_logger.info("B&L Motorcycles application started")
    
    def log_app_error(self, error, context=''):
        """Log application error"""
        self.app_logger.error(f"Application error{' - ' + context if context else ''}: {error}")
        self.error_logger.error(f"App error{' (' + context + ')' if context else ''}: {error}")
    
    def log_database_operation(self, operation, table, result):
        """Log database operations"""
        self.app_logger.info(f"Database {operation} on {table}: {result}")
    
    def log_api_request(self, endpoint, method, status_code, response_time=None):
        """Log API requests"""
        log_msg = f"API {method} {endpoint} - Status: {status_code}"
        if response_time:
            log_msg += f" - Time: {response_time:.3f}s"
        self.app_logger.info(log_msg)

# Global logger instance
bl_logger = BLMotorcyclesLogger()

# Convenience functions for easy import
def log_ftp_sync_start(sync_type='manual'):
    bl_logger.log_ftp_sync_start(sync_type)

def log_ftp_sync_success(result):
    bl_logger.log_ftp_sync_success(result)

def log_ftp_sync_error(error):
    bl_logger.log_ftp_sync_error(error)

def log_webhook_received(webhook_type, data):
    bl_logger.log_webhook_received(webhook_type, data)

def log_webhook_processed(webhook_type, result):
    bl_logger.log_webhook_processed(webhook_type, result)

def log_webhook_error(webhook_type, error):
    bl_logger.log_webhook_error(webhook_type, error)

def log_order_created(order_id, amount):
    bl_logger.log_order_created(order_id, amount)

def log_order_status_change(order_id, old_status, new_status):
    bl_logger.log_order_status_change(order_id, old_status, new_status)

def log_dropshipping_sent(order_id, supplier):
    bl_logger.log_dropshipping_sent(order_id, supplier)

def log_dropshipping_error(order_id, error):
    bl_logger.log_dropshipping_error(order_id, error)

def log_app_start():
    bl_logger.log_app_start()

def log_app_error(error, context=''):
    bl_logger.log_app_error(error, context)

def log_database_operation(operation, table, result):
    bl_logger.log_database_operation(operation, table, result)

def log_api_request(endpoint, method, status_code, response_time=None):
    bl_logger.log_api_request(endpoint, method, status_code, response_time)

