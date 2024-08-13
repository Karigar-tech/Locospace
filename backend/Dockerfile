# Use the official Node.js 18 Alpine image as the base image
FROM node:18-alpine AS base
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./
# Install dependencies
RUN npm ci --production
# Copy the firebase file to the container
COPY locospace-db7d8-firebase-adminsdk-t2pn7-094c75b21b.json ./locospace-db7d8-firebase-adminsdk-t2pn7-094c75b21b.json
# Copy the env file
COPY .env ./.env
# Copy the rest of the application files
COPY . .
# Expose the port that your Express app will run on
EXPOSE 5000
# Define the command to start your Express app
CMD ["npm", "start"]