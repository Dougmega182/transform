# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Remove the conflicting packages
RUN npm uninstall date-fns react-day-picker

# Install compatible versions
RUN npm install date-fns@3.6.0 react-day-picker@8.10.1

# Use legacy-peer-deps flag for npm ci
RUN npm ci --legacy-peer-deps
# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

