FROM node:22-alpine as build
WORKDIR /usr/src/billing
COPY package*.json ./
RUN yarn install --network-timeout 540000000
ADD . .
RUN yarn build billing

FROM node:22-alpine
WORKDIR /usr/src/billing
COPY package.json ./
COPY tsconfig.build.json ./
RUN yarn install --only=prod --legacy-peer-deps
RUN apk add --no-cache tzdata
COPY --from=build /usr/src/billing/dist ./dist/billing/auth