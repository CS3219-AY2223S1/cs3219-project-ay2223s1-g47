FROM node:alpine
WORKDIR /usr/frontend
COPY . /usr/frontend
RUN npm install --quiet
RUN PORT=4444 npx y-webrtc server&
CMD [ "npm", "run", "start" ]