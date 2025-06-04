FROM nginx:stable-alpine

ARG BASE64_ENCODED_SSL_CERT
ARG BASE64_ENCODED_SSL_KEY

RUN echo -n ${BASE64_ENCODED_SSL_CERT} | base64 -d > /etc/ssl/certs/default.crt
RUN echo -n ${BASE64_ENCODED_SSL_KEY} | base64 -d > /etc/ssl/private/default.key

RUN cat /etc/ssl/certs/default.crt
RUN cat /etc/ssl/private/default.key

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
