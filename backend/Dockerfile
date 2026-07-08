FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose backend port
EXPOSE 5000

# Start server using the "start" npm script (node server.js)
CMD ["npm", "start"]
