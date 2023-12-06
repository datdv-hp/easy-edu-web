# stage 1: build stage
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./ 
RUN yarn install

COPY . .
RUN yarn build-only

# stage2: production stage
FROM nginx:1.23.3-alpine as production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist .

EXPOSE 3010

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
