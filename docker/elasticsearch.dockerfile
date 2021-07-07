FROM elasticsearch:7.12.0

EXPOSE 9200 9300

RUN elasticsearch-plugin install analysis-smartcn && \
    elasticsearch-plugin install analysis-kuromoji

ENTRYPOINT [ "/bin/tini","/usr/local/bin/docker-entrypoint.sh" ]