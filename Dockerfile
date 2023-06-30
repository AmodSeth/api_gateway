FROM node:16.13.0-alpine
WORKDIR /application
RUN apk update && apk add bash
RUN apk update && apk add apache2-utils # for benchmarking

# Install PM2 globally
RUN npm install -g pm2
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:max_size 50M
RUN pm2 set pm2-logrotate:compress true

COPY . .
RUN chmod +x start-server.sh