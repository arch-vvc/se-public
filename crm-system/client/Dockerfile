# Minimal Dockerfile for Vite + React dev
FROM node:18-alpine
WORKDIR /usr/src/app

# Install deps first (cache)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Vite dev server should listen on 0.0.0.0 for container access
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
