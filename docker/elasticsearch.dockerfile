FROM elasticsearch:7.12.0

EXPOSE 9200 9300

RUN elasticsearch-plugin install analysis-smartcn && \
    elasticsearch-plugin install analysis-kuromoji

ENTRYPOINT [ "/bin/tini","/usr/local/bin/docker-entrypoint.sh" ]

HEALTHCHECK --interval=10s --timeout=5s --start-period=1m --retries=5 \
    CMD curl -I -f --max-time 5 http://localhost:9200 || exit 1