# Veganosapiens

URL: [https://veganosapiens.com](https://veganosapiens.com)

A fast, personal handmade vegan recipe website.

We use it quite often to cook our favourite recipes again and again.

## Nginx config

```
server {
    listen 80;
    server_name veganosapiens.com www.veganosapiens.com;
    return 301 https://veganosapiens.com$request_uri;
}

server {
    listen 443 ssl;
    server_name www.veganosapiens.com;
    return 301 https://veganosapiens.com$request_uri;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/veganosapiens.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/veganosapiens.com/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;   # managed by Certbot
}

server {
    listen 443 ssl default_server;
    server_name www.veganosapiens.com veganosapiens.com;

    # Disable caching
    add_header Cache-Control "no-cache";
    add_header X-Debug-Server veganosapiens;

    # Enable sendfile (should be faster)
    sendfile on;
    sendfile_max_chunk 1m;

    # TCP optimizations
    tcp_nopush on;
    tcp_nodelay on;

    # Text compression
    gzip on;
    gzip_types
            text/css
            text/javascript
            image/svg+xml;

    root /var/www/Veganosapiens;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/veganosapiens.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/veganosapiens.com/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
```

## License

Copyright 2023 Pablo Jiménez Mateo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
