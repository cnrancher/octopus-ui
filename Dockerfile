# build stage
FROM node:10-alpine as build-stage

RUN mkdir /src
WORKDIR /src

RUN apk update && apk upgrade

COPY package.json /src/
COPY yarn.lock /src/
RUN yarn --pure-lockfile install

COPY . /src
RUN yarn build

## production stage
FROM node:10-alpine as production-stage

RUN mkdir /src
WORKDIR /src

COPY --from=build-stage /src /src

EXPOSE 80
ENTRYPOINT ["yarn"]
CMD ["start"]
