FROM node:20.13-bullseye

ENV TZ Asia/Tokyo

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*