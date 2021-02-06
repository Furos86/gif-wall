FROM node:lts-alpine as build
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./babel.config.json ./
COPY ./webpack.config.js ./
RUN npm install
COPY ./src/ ./src
RUN npm run build:frontend

FROM node:lts-alpine
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --production
copy --from=build app/src/backend ./
COPY --from=build app/dist/front-end ./static
CMD node index.mjs
