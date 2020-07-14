FROM node:12 AS build
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod -- --configuration production

FROM nginx:1.19
COPY --from=build /usr/src/app/dist/cognito-ui /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf