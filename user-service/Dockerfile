FROM node:alpine
WORKDIR /usr/userService
COPY package.json .
RUN npm install --quiet
 CMD [ "npm", "run", "dev" ]