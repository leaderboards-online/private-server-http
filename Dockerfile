FROM node:18.16.0-bullseye

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

ENV PORT $PORT

RUN yarn build

EXPOSE $PORT

RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env cat /etc/secrets/.env
CMD ["yarn", "start"]