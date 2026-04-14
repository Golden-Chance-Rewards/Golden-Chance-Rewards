#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/golden-chance"
DOMAIN="${1:-}"
SSL_CERT_PATH="${2:-}"
SSL_KEY_PATH="${3:-}"
SERVICE_NAME="golden-chance"
NGINX_CONFIG="/etc/nginx/sites-available/${SERVICE_NAME}.conf"
APP_PORT=3000

cd "$APP_DIR"

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Building app..."
npm run build

echo "Starting/reloading app process..."
if command -v pm2 > /dev/null 2>&1; then
  if pm2 describe "$SERVICE_NAME" > /dev/null 2>&1; then
    pm2 reload "$SERVICE_NAME"
  else
    pm2 start npm --name "$SERVICE_NAME" -- start
  fi
  pm2 save
else
  echo "INFO: pm2 not found. Starting with nohup..."
  pkill -f "npm start" || true
  nohup npm start > "/var/log/${SERVICE_NAME}.log" 2>&1 &
  echo "App started on port $APP_PORT"
fi

# Setup nginx
mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

# Determine if SSL is available
USE_SSL=false
CERT_PATH=""
KEY_PATH=""

if [ -n "$SSL_CERT_PATH" ] && [ -n "$SSL_KEY_PATH" ]; then
  if [ -f "$SSL_CERT_PATH" ] && [ -f "$SSL_KEY_PATH" ]; then
    USE_SSL=true
    CERT_PATH="$SSL_CERT_PATH"
    KEY_PATH="$SSL_KEY_PATH"
  fi
elif [ -n "$DOMAIN" ]; then
  AUTO_CERT="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
  AUTO_KEY="/etc/letsencrypt/live/$DOMAIN/privkey.pem"
  if [ -f "$AUTO_CERT" ] && [ -f "$AUTO_KEY" ]; then
    USE_SSL=true
    CERT_PATH="$AUTO_CERT"
    KEY_PATH="$AUTO_KEY"
  fi
fi

if [ "$USE_SSL" = true ]; then
  echo "Configuring nginx with HTTPS..."
  cat > "$NGINX_CONFIG" <<NGINXEOF
server {
    listen 80;
    server_name ${DOMAIN:-_};
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN:-_};

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
NGINXEOF
else
  echo "No SSL certs found — configuring nginx with HTTP only..."
  cat > "$NGINX_CONFIG" <<NGINXEOF
server {
    listen 80 default_server;
    server_name _;

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
NGINXEOF
fi

ln -sf "$NGINX_CONFIG" "/etc/nginx/sites-enabled/${SERVICE_NAME}.conf"

# Remove default nginx config if it exists (conflicts with default_server)
rm -f /etc/nginx/sites-enabled/default

nginx -t && (systemctl reload nginx 2>/dev/null || service nginx reload)
echo "Deployment complete!"
