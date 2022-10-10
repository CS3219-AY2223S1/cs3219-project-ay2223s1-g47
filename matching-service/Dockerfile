FROM node:alpine
WORKDIR /usr/matching-service
COPY . /usr/matching-service
RUN npm ci
CMD [ "npm", "start" ] 