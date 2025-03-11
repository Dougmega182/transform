# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN npm install

# Stage 2: Builder
FROM node:18-bullseye AS builder
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y build-essential libssl-dev zlib1g-dev libbz2-dev \
    libreadline-dev libsqlite3-dev wget curl git

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./next
COPY --from=builder /app/.next/static ./static

RUN npm install

USER nextjs
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]