# Use the official Node.js 18 Alpine image as the base image
FROM node:18-alpine AS base
# Install dependencies only when needed
FROM base AS deps
# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./
# Install dependencies
RUN npm ci
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
# Copy dependencies installed in the previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application files
COPY . .
# Uncomment the following line to disable Next.js telemetry during the build
# ENV NEXT_TELEMETRY_DISABLED 1
# Build the Next.js application
RUN npm run build
# Production image, copy all the files and run Next.js
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
# Uncomment the following line to disable Next.js telemetry during runtime
# ENV NEXT_TELEMETRY_DISABLED 1
# Create a non-root user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Copy the public folder
COPY --from=builder /app/public ./public
# Set the correct permission for the .next folder
RUN mkdir .next
RUN chown nextjs:nodejs .next
# Copy the .next folder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# Copy the node_modules folder
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
# Copy package.json to ensure it exists in the final image
COPY --from=builder /app/package.json ./
# Set the user to nextjs
USER nextjs
# Expose port 3000
EXPOSE 3000
# Set the PORT environment variable
ENV PORT=3000
# Start the Next.js application
CMD ["npm", "start"]