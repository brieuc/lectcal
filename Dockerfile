FROM nginx:alpine

COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY index.html manifest.json /usr/share/nginx/html/

EXPOSE 80
