FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy application files
COPY package.json .
COPY master.js .
COPY worker.js .

# Install dependencies
RUN npm install

# Create necessary directories
RUN mkdir -p configs output

# Expose ports for generated apps
EXPOSE 3000-3020

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('OK')"

# Set environment
ENV NODE_ENV=production

# Run master node
CMD ["npm", "start"]