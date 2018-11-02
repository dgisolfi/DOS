FROM node:10-slim
MAINTAINER Daniel Gisolfi

# Update the enviorment
RUN apt-get update -y
# RUN apt-get install -y build-essential 

# Install TypeScript Compiler, gulp, and gulp typescript plugin
RUN npm install -g \
    typescript \
    http-server \
    gulp-tsc \
    gulp

WORKDIR /OS

COPY /public ./public
COPY package.json .
COPY package-lock.json .
COPY server.js .

EXPOSE 48000	

RUN npm install
CMD ["npm","start"]