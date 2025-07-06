# Stage 1: Build
FROM node:22-alpine AS builder

# Accept build argument for Vite env
ARG VITE_API_BASE_URL

# Make it available to the build as an environment variable
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build with Vite using the injected env
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Override default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
