FROM node:10.16.0
WORKDIR /usr/app
COPY client/package.json .
RUN yarn
COPY client .
EXPOSE 3274
CMD yarn run dev