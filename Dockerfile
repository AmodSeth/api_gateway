FROM node:14.15.4-alpine
WORKDIR /application
RUN apk update && apk add bash
RUN apk update && apk add apache2-utils # for benchmarking
COPY . .