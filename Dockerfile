FROM nginx:alpine

COPY index.html manifest.json /usr/share/nginx/html/
COPY sons /usr/share/nginx/html/sons

EXPOSE 80
