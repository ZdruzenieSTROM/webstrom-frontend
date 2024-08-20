FROM node:20

ARG NEXT_PUBLIC_BE_PORT

WORKDIR /app

COPY . /app

RUN yarn && yarn build

ENTRYPOINT [ "yarn", "start", "-H", "localhost" ]
