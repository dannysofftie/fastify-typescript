FROM node:11

WORKDIR /app

COPY . .

RUN npm install --no-progress --quiet
RUN npm run build

CMD [ "npm", "start", "--silent" ]