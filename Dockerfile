# Use the official Node.js 18 image as a base
FROM node:18-bullseye

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire application
COPY . .

# Generate Prisma client before building the app
RUN npx prisma generate

# Build your Next.js app
RUN npm run build

# Expose the app's port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
