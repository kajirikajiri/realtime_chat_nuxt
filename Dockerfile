FROM node:10.16.0
WORKDIR /usr/app
COPY client/package.json .
# RUN npm i
COPY client .
EXPOSE 3247
CMD npm run dev