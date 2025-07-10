import time
import functools
import random
from typing import Callable, Any, Optional, List, Type
from src.services.logging_service import bl_logger

class RetryService:
    """Service for handling retry logic with exponential backoff"""
    
    @staticmethod
    def retry_with_backoff(
        max_retries: int = 3,
        base_delay: float = 1.0,
        max_delay: float = 60.0,
        exponential_base: float = 2.0,
        jitter: bool = True,
        exceptions: Optional[List[Type[Exception]]] = None
    ):
        """
        Decorator for retrying functions with exponential backoff
        
        Args:
            max_retries: Maximum number of retry attempts
            base_delay: Initial delay between retries in seconds
            max_delay: Maximum delay between retries in seconds
            exponential_base: Base for exponential backoff calculation
            jitter: Whether to add random jitter to delay
            exceptions: List of exception types to retry on (None = all exceptions)
        """
        if exceptions is None:
            exceptions = [Exception]
        
        def decorator(func: Callable) -> Callable:
            @functools.wraps(func)
            def wrapper(*args, **kwargs) -> Any:
                last_exception = None
                
                for attempt in range(max_retries + 1):
                    try:
                        result = func(*args, **kwargs)
                        
                        # Log successful retry if this wasn't the first attempt
                        if attempt > 0:
                            bl_logger.app_logger.info(
                                f"Function {func.__name__} succeeded on attempt {attempt + 1}"
                            )
                        
                        return result
                        
                    except Exception as e:
                        last_exception = e
                        
                        # Check if this exception type should be retried
                        if not any(isinstance(e, exc_type) for exc_type in exceptions):
                            bl_logger.app_logger.error(
                                f"Function {func.__name__} failed with non-retryable exception: {e}"
                            )
                            raise e
                        
                        # Don't retry if this was the last attempt
                        if attempt == max_retries:
                            break
                        
                        # Calculate delay with exponential backoff
                        delay = min(
                            base_delay * (exponential_base ** attempt),
                            max_delay
                        )
                        
                        # Add jitter to prevent thundering herd
                        if jitter:
                            delay *= (0.5 + random.random() * 0.5)
                        
                        bl_logger.app_logger.warning(
                            f"Function {func.__name__} failed on attempt {attempt + 1}/{max_retries + 1}: {e}. "
                            f"Retrying in {delay:.2f} seconds..."
                        )
                        
                        time.sleep(delay)
                
                # All retries exhausted
                bl_logger.error_logger.error(
                    f"Function {func.__name__} failed after {max_retries + 1} attempts. "
                    f"Last error: {last_exception}"
                )
                raise last_exception
            
            return wrapper
        return decorator
    
    @staticmethod
    def retry_ftp_operation(func: Callable) -> Callable:
        """Specific retry decorator for FTP operations"""
        return RetryService.retry_with_backoff(
            max_retries=3,
            base_delay=2.0,
            max_delay=30.0,
            exceptions=[ConnectionError, TimeoutError, OSError]
        )(func)
    
    @staticmethod
    def retry_database_operation(func: Callable) -> Callable:
        """Specific retry decorator for database operations"""
        return RetryService.retry_with_backoff(
            max_retries=2,
            base_delay=1.0,
            max_delay=10.0,
            exceptions=[ConnectionError, TimeoutError]
        )(func)
    
    @staticmethod
    def retry_email_operation(func: Callable) -> Callable:
        """Specific retry decorator for email operations"""
        return RetryService.retry_with_backoff(
            max_retries=3,
            base_delay=1.5,
            max_delay=20.0,
            exceptions=[ConnectionError, TimeoutError, OSError]
        )(func)
    
    @staticmethod
    def retry_webhook_operation(func: Callable) -> Callable:
        """Specific retry decorator for webhook operations"""
        return RetryService.retry_with_backoff(
            max_retries=2,
            base_delay=0.5,
            max_delay=5.0,
            exceptions=[ConnectionError, TimeoutError]
        )(func)

class FailedOperationQueue:
    """Queue for managing failed operations that need to be retried later"""
    
    def __init__(self):
        self.failed_operations = []
    
    def add_failed_operation(self, operation_type: str, operation_data: dict, error: str):
        """Add a failed operation to the retry queue"""
        failed_op = {
            'type': operation_type,
            'data': operation_data,
            'error': error,
            'timestamp': time.time(),
            'retry_count': 0,
            'max_retries': 5
        }
        
        self.failed_operations.append(failed_op)
        
        bl_logger.app_logger.info(
            f"Added failed operation to retry queue: {operation_type}"
        )
    
    def process_failed_operations(self):
        """Process all failed operations in the queue"""
        if not self.failed_operations:
            return
        
        bl_logger.app_logger.info(
            f"Processing {len(self.failed_operations)} failed operations"
        )
        
        operations_to_remove = []
        
        for i, operation in enumerate(self.failed_operations):
            try:
                success = self._retry_operation(operation)
                
                if success:
                    operations_to_remove.append(i)
                    bl_logger.app_logger.info(
                        f"Successfully retried operation: {operation['type']}"
                    )
                else:
                    operation['retry_count'] += 1
                    
                    # Remove operation if max retries exceeded
                    if operation['retry_count'] >= operation['max_retries']:
                        operations_to_remove.append(i)
                        bl_logger.error_logger.error(
                            f"Operation {operation['type']} failed permanently after "
                            f"{operation['max_retries']} retries"
                        )
                        
            except Exception as e:
                bl_logger.error_logger.error(
                    f"Error processing failed operation {operation['type']}: {e}"
                )
        
        # Remove processed operations (in reverse order to maintain indices)
        for i in reversed(operations_to_remove):
            del self.failed_operations[i]
    
    def _retry_operation(self, operation: dict) -> bool:
        """Retry a specific operation"""
        operation_type = operation['type']
        operation_data = operation['data']
        
        try:
            if operation_type == 'ftp_sync':
                from src.services.ftp_sync_supabase import sync_bikeit_products
                result = sync_bikeit_products()
                return 'error' not in result
                
            elif operation_type == 'dropshipping_email':
                from src.services.dropshipping import send_bikeit_order
                order_data = operation_data
                # Create mock order object
                class MockOrder:
                    def __init__(self, data):
                        for key, value in data.items():
                            setattr(self, key, value)
                
                mock_order = MockOrder(order_data)
                return send_bikeit_order(mock_order)
                
            elif operation_type == 'order_confirmation':
                from src.services.dropshipping import send_order_confirmation
                order_data = operation_data
                class MockOrder:
                    def __init__(self, data):
                        for key, value in data.items():
                            setattr(self, key, value)
                
                mock_order = MockOrder(order_data)
                return send_order_confirmation(mock_order)
                
            else:
                bl_logger.app_logger.warning(
                    f"Unknown operation type for retry: {operation_type}"
                )
                return False
                
        except Exception as e:
            bl_logger.app_logger.error(
                f"Retry attempt failed for {operation_type}: {e}"
            )
            return False
    
    def get_queue_status(self) -> dict:
        """Get status of the failed operations queue"""
        return {
            'total_operations': len(self.failed_operations),
            'operations_by_type': self._count_by_type(),
            'oldest_operation': self._get_oldest_operation_age()
        }
    
    def _count_by_type(self) -> dict:
        """Count operations by type"""
        counts = {}
        for operation in self.failed_operations:
            op_type = operation['type']
            counts[op_type] = counts.get(op_type, 0) + 1
        return counts
    
    def _get_oldest_operation_age(self) -> Optional[float]:
        """Get age of oldest operation in seconds"""
        if not self.failed_operations:
            return None
        
        oldest_timestamp = min(op['timestamp'] for op in self.failed_operations)
        return time.time() - oldest_timestamp

# Global failed operation queue
failed_operation_queue = FailedOperationQueue()

# Convenience functions
def add_failed_operation(operation_type: str, operation_data: dict, error: str):
    """Add a failed operation to the global retry queue"""
    failed_operation_queue.add_failed_operation(operation_type, operation_data, error)

def process_failed_operations():
    """Process all failed operations in the global queue"""
    failed_operation_queue.process_failed_operations()

def get_queue_status():
    """Get status of the global failed operations queue"""
    return failed_operation_queue.get_queue_status()

