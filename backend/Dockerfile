# Use an official Node.js runtime as the base image
FROM node:21-alpine

# Set the working directory
WORKDIR /api

# Copy package.json and yarn.lock to leverage Docker layer caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy the rest of the application code
COPY . .

# Build the application
# RUN yarn run build:prod

# Expose the port the app runs on
# EXPOSE 5000

# Ensure the start script has execution permissions
RUN chmod +x ./scripts/start.sh

# Start the application
CMD ["sh", "./scripts/start.sh"]