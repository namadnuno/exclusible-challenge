FROM node:16-alpine

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

COPY package*.json /usr/src/app

RUN npm install

COPY . /usr/src/app

COPY --chown=node:node . .

EXPOSE $API_PORT
