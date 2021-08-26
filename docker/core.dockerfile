FROM node:alpine

EXPOSE 3000

COPY ./ /data

WORKDIR /data

RUN yarn install && \
    yarn run build

CMD [ "/bin/sh","-xve","./docker/entrypoint" ]

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
    CMD [ "/bin/sh","wget","-qO","-","localhost:3000/api/statistics" ]