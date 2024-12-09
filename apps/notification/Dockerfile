FROM node:alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install --network-timeout 540000000
COPY . .
RUN yarn build notification

FROM node:alpine AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install --only=prod --legacy-peer-deps
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/apps/notification/main"]