FROM node:20

ARG BE_PROTOCOL
ARG BE_HOSTNAME
ARG BE_PORT
ARG BE_PREFIX

WORKDIR /app

COPY . /app

RUN yarn && yarn build

ENTRYPOINT [ "yarn", "start", "-H", "localhost" ]
