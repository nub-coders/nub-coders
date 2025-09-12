# Use the official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the entire application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S portfolio -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R portfolio:nodejs /app
USER portfolio

# Define the command to run the application
CMD ["sh", "-c", "git reset --hard && git stash && git pull && rm -f package-lock.json && npm install && npm run dev"]