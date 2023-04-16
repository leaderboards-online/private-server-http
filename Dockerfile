FROM node:18.16.0-bullseye

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .
ARG node_env=docker
ENV node_env $node_env

RUN yarn build

EXPOSE $PORT

CMD ["yarn", "start"]