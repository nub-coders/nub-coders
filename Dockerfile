# Use Alpine Linux as the base image (much smaller than Debian)
FROM alpine:latest

# Install system dependencies using Alpine's package manager
RUN apk update && apk add --no-cache \
    git \
    curl \
    wget \
    build-base \
    nodejs \
    npm \
    nginx \
    bash

# Set working directory
WORKDIR /app

# Clone the repository with authentication
RUN echo "Force rebuild $(date)"
ARG GITHUB_TOKEN
RUN git clone https://${GITHUB_TOKEN}@github.com/nub-coders/portfolio . || echo "Repository already exists"

# Install Node.js dependencies and build frontend
RUN npm ci && \
    npm run build

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Configure directory for Nginx
RUN mkdir -p /run/nginx

# Make directory for logs
RUN mkdir -p /var/log/app

# Expose port 8080
EXPOSE 8080

# Start script with auto-update and serve
CMD ["bash", "-c", "cd /app && git reset --hard && git stash && git pull && nginx && npm run dev"]