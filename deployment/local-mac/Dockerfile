FROM node:20

ARG NEXT_PUBLIC_BE_PORT
ARG NEXT_PUBLIC_BE_HOSTNAME

WORKDIR /app

COPY . /app

RUN yarn && yarn build

ENTRYPOINT [ "yarn", "start", "-H", "0.0.0.0" ]

