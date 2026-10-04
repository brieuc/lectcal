FROM nginx:alpine

COPY index.html manifest.json /usr/share/nginx/html/

EXPOSE 80
