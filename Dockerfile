# Base image
FROM node:18-alpine

# Set work dir
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start:prod"]
