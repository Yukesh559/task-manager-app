# Stage 1: Build the Expo web app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx expo export --platform web


# Stage 2: Serve the web app with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Make Expo Router routes work correctly
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
