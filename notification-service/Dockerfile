# Use Node
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files
COPY notification-service/package*.json ./

# Install dependencies
RUN npm install

# Copy service code
COPY notification-service/ .

# Copy shared code
COPY shared/ ./shared

# Start app
CMD ["node", "index.js"]