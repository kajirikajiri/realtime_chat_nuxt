FROM node:10.16.0
WORKDIR /usr/app
COPY client/package.json .
RUN npm i
COPY client .
EXPOSE 3274
CMD node index.js