# Use the official Node.js image as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install PNPM globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (or yarn.lock) files first to leverage Docker caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies using PNPM
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN pnpm build

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["pnpm", "start"]
