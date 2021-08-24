FROM node:alpine

EXPOSE 3000

COPY ./ /data

WORKDIR /data

RUN yarn install && \
    yarn run build

CMD [ "/bin/sh","-xve","./docker/entrypoint" ]