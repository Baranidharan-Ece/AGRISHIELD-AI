# ─── Build Stage ──────────────────────────────────────────────────────────────
FROM node:18-alpine AS build

# Accept VITE_API_URL as a build argument so Vite can embed it into the bundle.
# In Render: Settings → Build Command should include --build-arg or use Render's
# native env var support (Render auto-passes env vars to Docker build-args).
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .

# Vite reads VITE_* vars from process.env at build time
RUN npm run build

# ─── Production Stage ─────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy built React assets
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config: serve SPA, forward all unknown paths to index.html
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    # Cache static assets\n\
    location ~* \\.(?:css|js|woff2?|png|jpg|svg|ico)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
