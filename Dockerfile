FROM node:10-slim
MAINTAINER Daniel Gisolfi

# Update the enviorment
RUN apt-get update -y

# Install TypeScript Compiler, gulp, and gulp typescript plugin
RUN npm install -g \
    typescript \
    gulp-tsc \
    gulp

WORKDIR /OS

COPY . .
# COPY /distrib .

# CMD [ "gulp" ]