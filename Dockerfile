# Use a Debian-based Node.js image
FROM node:18-bullseye

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using npm ci (which installs based on package-lock.json)
RUN npm ci --force

# Copy the prisma folder containing the schema.prisma file
COPY prisma ./prisma

# Run Prisma generate to generate the client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
