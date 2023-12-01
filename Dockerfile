# Use an official Node.js runtime as a parent image
FROM node:14-slim

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Expose the port the app will run on
EXPOSE 9090

# Define the command to start the app
CMD ["npm", "start"]