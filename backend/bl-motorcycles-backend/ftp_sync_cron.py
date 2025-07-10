#!/usr/bin/env python3
"""
FTP Sync Cron Job Script for B&L Motorcycles
This script runs every 2 hours to synchronize products from Bike It FTP feed
"""

import os
import sys
import logging
from datetime import datetime

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Set up logging
log_file = '/var/log/bl_motorcycles_ftp_sync.log'
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def main():
    """Main function for cron job execution"""
    try:
        logger.info("=" * 50)
        logger.info("Starting FTP synchronization cron job")
        logger.info(f"Timestamp: {datetime.now().isoformat()}")
        
        # Import and run the sync function
        from services.ftp_sync import sync_bikeit_products
        
        # Execute synchronization
        result = sync_bikeit_products()
        
        if 'error' in result:
            logger.error(f"Synchronization failed: {result['error']}")
            sys.exit(1)
        else:
            logger.info(f"Synchronization completed successfully: {result}")
            logger.info("FTP synchronization cron job finished")
        
    except Exception as e:
        logger.error(f"Cron job failed with exception: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

