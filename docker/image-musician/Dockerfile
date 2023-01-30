FROM node:17-alpine

COPY src/* /var/opt/
WORKDIR /var/opt
RUN npm install

ENTRYPOINT ["node", "index.js"]