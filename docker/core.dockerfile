FROM node:alpine

EXPOSE 3000

COPY ./ /data

WORKDIR /data

RUN yarn global add @nestjs/cli && \
    yarn install && \
    yarn run build

CMD [ "/bin/sh","./docker/entrypoint" ]