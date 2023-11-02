FROM node:alpine3.18

WORKDIR /app

COPY . .

EXPOSE 3000

RUN npm install
 
CMD [ "node", "index.js" ] 
