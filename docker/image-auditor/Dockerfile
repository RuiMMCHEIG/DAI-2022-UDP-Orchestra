FROM node:latest

EXPOSE 2205/tcp

EXPOSE 2023/udp

EXPOSE 3000

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY src/ /home/node/app

ENTRYPOINT ["node", "/home/node/app/index.js"]