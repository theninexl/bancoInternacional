FROM nginx:mainline-alpine

WORKDIR /app
COPY [ "./env.sh", ".env", "entrypoint", "./" ]

RUN apk add --no-cache bash && \
    mkdir -p /var/www/ && \
    touch /var/www/env-config.js && \
    chmod 777 /var/www/env-config.js && \
    chmod +x env.sh

COPY ./dist /var/www/
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R 101:0 /var/cache/nginx \
    && chmod -R g+w /var/cache/nginx \
    && chown -R nginx: /app /var/www \
    && chmod 755 /app/entrypoint \
    && chown -R nginx: /app/entrypoint

USER nginx
EXPOSE 8080

CMD ["/app/entrypoint"]
