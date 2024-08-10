FROM node:alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install 

#Expose the port your application will run on
EXPOSE 80 443

CMD ["ng", "serve", "--host", "0.0.0.0"]