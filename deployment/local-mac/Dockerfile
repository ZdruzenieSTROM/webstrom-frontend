FROM node:20

ARG BE_PROTOCOL
ARG BE_HOSTNAME
ARG BE_PORT

WORKDIR /app

COPY . /app

RUN yarn && yarn build

ENTRYPOINT [ "yarn", "start", "-H", "0.0.0.0" ]

