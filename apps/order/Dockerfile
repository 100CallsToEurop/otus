FROM node:alpine as development
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install --network-timeout 540000000
COPY . .
RUN yarn build order

FROM node:alpine as production
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install --only=prod --legacy-peer-deps
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/apps/order/main"]