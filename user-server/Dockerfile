FROM node:16.13.0-alpine3.14

WORKDIR /opt/app

COPY . .

RUN npm install --only=production

ARG NODE_ENV_VAR=production
ENV NODE_ENV $NODE_ENV_VAR

CMD ["node", "index.js"]

