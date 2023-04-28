FROM node:19.0.0-alpine3.16 as builder
LABEL maintainer "narendrajhala@hoicko.com"

WORKDIR /app
EXPOSE 3000

COPY package.json ./
RUN touch .env
RUN set -x && yarn

COPY dist ./
COPY .env ./

CMD [ "yarn", "install --production" ]
CMD [ "yarn", "start:prod" ]