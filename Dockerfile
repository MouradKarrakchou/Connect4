# Use a Node.js image using a parent image
FROM node:16.13.2

# It looks like puting the node environment to prodduction is better for the performances
#I hope it is true
ENV NODE_ENV=production

# Define the work directory
WORKDIR /app

# Cpoy the files from the app to the work directory
COPY . .

# Install the dependencies in the app
RUN npm install

# Expose the 8000 port
EXPOSE 8000

# Define the command to execute to run the app
CMD ["npm", "start"]
