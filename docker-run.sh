#!/bin/bash

# Make the script executable with: chmod +x docker-run.sh

# Check if .env file exists, if not create it
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "# GitHub Token needed to clone the repository" > .env
    echo "GITHUB_TOKEN=your_github_token_here" >> .env
    echo ""
    echo "⚠️ IMPORTANT: Edit the .env file and add your GitHub token before continuing!"
    echo "Then run this script again."
    exit 1
fi

# Check if the GitHub token has been set
if grep -q "your_github_token_here" .env; then
    echo "⚠️ Please edit the .env file and replace 'your_github_token_here' with your actual GitHub token."
    echo "Then run this script again."
    exit 1
fi

# Stop and remove existing containers
echo "Stopping any existing portfolio containers..."
docker-compose down

# Build and start the Docker container
echo "Building and starting the portfolio Docker container..."
docker-compose up -d

# Display running containers
echo "Container is now running:"
docker-compose ps

echo "Portfolio is available at: http://localhost:8080"
echo ""
echo "✅ Successfully deployed! Your portfolio is now running."