# Use Node
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files
COPY order-service/package*.json ./

# Install dependencies
RUN npm install

# Copy service code
COPY order-service/ .

# Copy shared code
COPY shared/ ./shared

# Expose port
EXPOSE 3001

# Start app
CMD ["node", "index.js"]