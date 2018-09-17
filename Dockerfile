FROM node:10-slim
MAINTAINER Daniel Gisolfi

# Update the enviorment
RUN apt-get update -y

# Install TypeScript Compiler, gulp, and gulp typescript plugin
RUN npm install -g \
    typescript \
    http-server \
    gulp-tsc \
    gulp

WORKDIR /OS

# COPY . .
# COPY /test
COPY index.html .
COPY package.json .
COPY /distrib .

EXPOSE 6000

RUN npm install
CMD ["npm","http-server -p6000"]