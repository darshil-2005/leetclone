FROM debian:bookworm-slim

RUN apt update && \
    apt-get install -y python3 nodejs npm build-essential && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m runner

WORKDIR /home/runner/src

COPY dockerRunner.js .

USER runner

ENTRYPOINT ["node", "dockerRunner.js"]
