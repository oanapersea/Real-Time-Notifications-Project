FROM node:16 as builder
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build


FROM nginx:1.17-alpine
RUN apk --no-cache add wget git go gcc musl-dev && \
    git clone https://github.com/a8m/envsubst.git /tmp/envsubst && \
    cd /tmp/envsubst && \
    go build -o /usr/local/bin/envsubst ./cmd/envsubst && \
    rm -rf /tmp/envsubst


COPY --from=builder /app/nginx.conf /etc/nginx/nginx.template
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
COPY --from=builder /app/build/ /usr/share/nginx/html