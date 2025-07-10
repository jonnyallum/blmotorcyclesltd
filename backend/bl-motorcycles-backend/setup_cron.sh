#!/bin/bash

# Setup script for B&L Motorcycles FTP synchronization cron job
# This script sets up the cron job to run every 2 hours

echo "Setting up B&L Motorcycles FTP sync cron job..."

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/ftp_sync_cron.py"
VENV_PATH="$SCRIPT_DIR/venv/bin/activate"

# Make the Python script executable
chmod +x "$PYTHON_SCRIPT"

# Create the cron job command
CRON_COMMAND="0 */2 * * * cd $SCRIPT_DIR && source $VENV_PATH && python $PYTHON_SCRIPT >> /var/log/bl_motorcycles_ftp_sync.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "ftp_sync_cron.py"; then
    echo "Cron job already exists. Updating..."
    # Remove existing cron job
    crontab -l 2>/dev/null | grep -v "ftp_sync_cron.py" | crontab -
fi

# Add the new cron job
(crontab -l 2>/dev/null; echo "$CRON_COMMAND") | crontab -

# Create log file if it doesn't exist
sudo touch /var/log/bl_motorcycles_ftp_sync.log
sudo chmod 666 /var/log/bl_motorcycles_ftp_sync.log

echo "Cron job setup complete!"
echo "The FTP sync will run every 2 hours."
echo "Log file: /var/log/bl_motorcycles_ftp_sync.log"
echo ""
echo "To view current cron jobs: crontab -l"
echo "To view sync logs: tail -f /var/log/bl_motorcycles_ftp_sync.log"
echo ""
echo "Manual sync command:"
echo "cd $SCRIPT_DIR && source $VENV_PATH && python ftp_sync_cron.py"

