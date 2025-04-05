# Base image
FROM node:18-alpine

# Set work dir
WORKDIR /app

RUN apk add --no-cache python3 make g++
# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest
COPY . .

RUN npx prisma generate
# Build app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start:prod"]
