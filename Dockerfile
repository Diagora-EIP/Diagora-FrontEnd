FROM node:19-alpine3.16

COPY . /Diagora/FrontEnd

WORKDIR /Diagora/FrontEnd

RUN npm install

CMD npm start
