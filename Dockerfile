FROM node:10.16.0 as build

COPY package.json /tmp/package.json
RUN cd /tmp && yarn install
RUN mkdir -p /app && cp -a /tmp/node_modules /app
COPY . /app
WORKDIR /app
RUN yarn lint:nofix
RUN yarn test:unit
RUN yarn build

FROM nginx:alpine as production
RUN rm -rf /etc/nginx/nginx.conf
ADD nginx.conf.template  /etc/nginx/nginx.conf.template
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '$SERVER_URL' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
