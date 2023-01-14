FROM node:lts-alpine as build
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY ./src/ ./src
COPY ./babel.config.json ./
COPY ./webpack.config.js ./
RUN npm run build:frontend

FROM node:lts-alpine
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --production
COPY --from=build app/src/backend ./
COPY --from=build app/dist/front-end ./static
CMD node index.mjs
