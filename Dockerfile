# Use a Debian-based Node.js image
FROM node:18-bullseye

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --force

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

RUN npx prisma generate
# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
