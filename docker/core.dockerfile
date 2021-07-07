FROM node:alpine

EXPOSE 3000

COPY ./ /data

RUN npm install -g yarn && \
    yarn install --production && \
    yarn run build

ENTRYPOINT [ "yarn","run","start:prod" ]