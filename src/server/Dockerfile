# Use the official Node.js image from Docker Hub
FROM node:20

# Install unixodbc and any other necessary dependencies
RUN apt-get update && apt-get install -y unixodbc

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
