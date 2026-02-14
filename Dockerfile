# ================================
# Stage 1: Build the TripEZ app
# ================================
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .
RUN npm run build

# ================================
# Stage 2: Serve with Nginx
# ================================
FROM nginx:stable-alpine
LABEL maintainer="burhanb53"

# Clean default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built app to nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
