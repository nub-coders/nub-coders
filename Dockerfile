# Use the official Node.js runtime as the base image
FROM node:current-alpine

# Set the working directory in the container
WORKDIR /app

# Create a non-root user for security (do this early)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S portfolio -u 1001 -G nodejs

# Change ownership of the app directory to the portfolio user
RUN chown -R portfolio:nodejs /app

# Switch to non-root user early
USER portfolio

# Copy package.json and package-lock.json (if available)
COPY --chown=portfolio:nodejs package*.json ./

# Install dependencies
RUN npm install && \
    npm cache clean --force

# Copy the entire application code
COPY --chown=portfolio:nodejs . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the application
CMD ["npm", "start"]
