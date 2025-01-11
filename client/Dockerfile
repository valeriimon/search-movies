# Stage 1: Build
FROM node:18 AS build

# Create app directory
WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the React app
COPY . .

# Build production-ready static files
RUN npm run build


# Stage 2: Production
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from Stage 1 to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Nginx starts by default in the foreground
CMD ["nginx", "-g", "daemon off;"]
