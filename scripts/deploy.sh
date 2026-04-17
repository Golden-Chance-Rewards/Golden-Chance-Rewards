#!/usr/bin/env bash
# Usage: ./scripts/deploy.sh
set -euo pipefail
``
SERVER_IP="104.248.207.103"
SSH_USER="root"
SSH_PASS="Goldenchance2026KW"
REMOTE_DIR="/var/www/golden-chance"

echo "==> Starting Local Build to save server RAM..."
npm run build

echo "==> Syncing files to server..."
# We use sshpass for password authentication
# Syncing everything including .next build folder
sshpass -p "$SSH_PASS" rsync -az --delete \
  --exclude='.git' \
  --exclude='.github' \
  --exclude='.env.local' \
  -e "ssh -o StrictHostKeyChecking=no" \
  ./ "$SSH_USER@$SERVER_IP:$REMOTE_DIR/"

echo "==> Restarting application on server..."
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_USER@$SERVER_IP" bash -s << 'ENDSSH'
set -e
cd /var/www/golden-chance

# Start/Restart with PM2
if command -v pm2 > /dev/null 2>&1; then
  pm2 delete golden-chance || true
  pm2 start npm --name "golden-chance" -- start
  pm2 save
else
  pkill -f "npm start" || true
  nohup npm start > "/var/log/golden-chance.log" 2>&1 &
fi

# Ensure Nginx is pointing to port 3000
if [ ! -f /etc/nginx/sites-available/golden-chance.conf ]; then
    cat > /etc/nginx/sites-available/golden-chance.conf <<NGINXEOF
server {
    listen 80;
    server_name _;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINXEOF
    ln -sf /etc/nginx/sites-available/golden-chance.conf /etc/nginx/sites-enabled/golden-chance.conf
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl restart nginx
fi
ENDSSH

echo "==> Deployment Complete!"
echo "==> Live at: https://goldenchance.win"
