# Multi-stage build for B&L Motorcycles full-stack application

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/bl-motorcycles-frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/bl-motorcycles-frontend/ ./
RUN npm run build

# Stage 2: Setup Backend and Final Image
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    cron \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy backend files
COPY backend/bl-motorcycles-backend/ ./backend/
COPY .env ./

# Install Python dependencies
RUN cd backend && \
    pip install --no-cache-dir -r requirements.txt

# Copy built frontend files to Flask static directory
COPY --from=frontend-builder /app/frontend/dist ./backend/static/

# Create logs directory
RUN mkdir -p /var/log/bl_motorcycles && \
    chmod 755 /var/log/bl_motorcycles

# Setup cron job for FTP sync
RUN cd backend && \
    chmod +x setup_cron.sh && \
    ./setup_cron.sh

# Create startup script
RUN echo '#!/bin/bash\n\
cd /app/backend\n\
# Start cron daemon\n\
cron\n\
# Start Flask application\n\
python src/main_supabase.py' > /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/api/health || exit 1

# Start the application
CMD ["/app/start.sh"]

