FROM node:21-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
# RUN yarn build

# EXPOSE 5173

CMD [ "yarn", "start" ]
