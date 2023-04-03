FROM bayesimpact/react-base:latest

COPY . /Diagora/FrontEnd

WORKDIR /Diagora/FrontEnd

RUN npm install

CMD npm start
