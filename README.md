# syslog2sqlite

Extemely hacky daemon that stores syslog messages from NGINX to a database

# Setup

1. Add the following log format to your NGINX config:

```
log_format json_log escape=json
    '{'
        '"timestamp": $msec,'
        '"requestLen": $request_length,'
        '"status": $status,'
        '"remoteAddr": "$remote_addr",'
        '"requestMethod": "$request_method",'
        '"requestUri": "$request_uri",'
        '"protocol": "$server_protocol",'
        '"referrer": "$http_referrer",'
        '"userAgent": "$http_user_agent",'
        '"host": "$host"'
    '}';
```

2. Tell NGINX to log messages via syslog.

```
access_log syslog:server=localhost:1234,facility=local7,tag=nginx,severity=info json_log;
```

3. Start syslog2sqlite.

```
SYSLOG_PORT=1234 node index.js
```

A Docker image for syslog2sqlite is also available on [Docker Hub](https://hub.docker.com/r/adrian154/syslog2sqlite). Here's how you might set that up in Docker Compose:


```yml
  syslog2sqlite:
    image: adrian154/syslog2sqlite
    container_name: syslog2sqlite
    volumes:
     - /srv/syslog2sqlite/requests.db:/app/requests.db
    ports:
     - "127.0.0.1:1234:1234/udp"
    environment:
     - SYSLOG_PORT=1234
    restart: unless-stopped
```