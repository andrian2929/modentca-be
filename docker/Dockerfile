FROM node:18-alpine

WORKDIR /app

ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apk update && apk upgrade

RUN apk add --no-cache \
    bash \
    git \
    vim \
    openssh \
    make \
    curl \
    wget \
    nano \
    tzdata \
    && rm -rf /var/cache/apk/*

EXPOSE 3000








