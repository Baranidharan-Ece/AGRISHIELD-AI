FROM node:18-alpine

# Install Python and dependencies for ML scripts
RUN apk add --no-cache python3 py3-pip build-base g++

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
