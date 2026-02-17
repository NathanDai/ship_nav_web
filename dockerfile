FROM registry.cn-hangzhou.aliyuncs.com/dashwood/node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --registry=https://registry.npmmirror.com

COPY . .

RUN touch .env
RUN echo "REACT_APP_API_URL=http://data_new_api:6001" > .env


RUN npm run build

FROM registry.cn-hangzhou.aliyuncs.com/dashwood/nginx:1.23.4

COPY --from=build /app/build /usr/share/nginx/html

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir /etc/nginx/ssl/
RUN touch /etc/nginx/ssl/certificate.pem
RUN touch /etc/nginx/ssl/private.key

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
