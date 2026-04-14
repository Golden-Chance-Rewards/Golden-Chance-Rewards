#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/golden-chance"
DOMAIN="${1:-}"
SSL_CERT_PATH="${2:-}"
SSL_KEY_PATH="${3:-}"
SERVICE_NAME="golden-chance"
NGINX_CONFIG="/etc/nginx/sites-available/${SERVICE_NAME}.conf"
APP_PORT=3000

if [ -z "$DOMAIN" ]; then
  echo "ERROR: Deployment domain is required."
  echo "Usage: $0 <domain> [ssl_cert_path] [ssl_key_path]"
  exit 1
fi

cd "$APP_DIR"

if [ -n "$SSL_CERT_PATH" ] && [ -n "$SSL_KEY_PATH" ]; then
  CERT_PATH="$SSL_CERT_PATH"
  KEY_PATH="$SSL_KEY_PATH"
else
  CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
  KEY_PATH="/etc/letsencrypt/live/$DOMAIN/privkey.pem"
fi

if [ ! -f "$CERT_PATH" ] || [ ! -f "$KEY_PATH" ]; then
  echo "ERROR: SSL certificate or key not found."
  echo "  cert: $CERT_PATH"
  echo "  key: $KEY_PATH"
  exit 1
fi

echo "Deploying app to $APP_DIR"

npm install
npm run build

if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe "$SERVICE_NAME" >/dev/null 2>&1; then
    pm2 reload "$SERVICE_NAME"
  else
    pm2 start npm --name "$SERVICE_NAME" -- start
  fi
  pm2 save
else
  echo "INFO: pm2 not installed. Starting app in background with nohup."
  nohup npm start > "/var/log/${SERVICE_NAME}.log" 2>&1 &
fi

mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

cat > "$NGINX_CONFIG" <<'EOF'
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate $CERT_PATH;
    ssl_certificate_key $KEY_PATH;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffers 16 64k;
        proxy_buffer_size 128k;
    }
}
EOF

ln -sf "$NGINX_CONFIG" "/etc/nginx/sites-enabled/${SERVICE_NAME}.conf"

nginx -t
systemctl reload nginx || service nginx reload
