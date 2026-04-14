#!/usr/bin/env bash
# Usage: ./scripts/deploy.sh <server_ip> <ssh_user> [ssh_key_path]
# Example: ./scripts/deploy.sh 104.248.207.103 root ~/.ssh/id_rsa
set -euo pipefail

SERVER_IP="${1:-104.248.207.103}"
SSH_USER="${2:-root}"
SSH_KEY="${3:-$HOME/.ssh/id_rsa}"
REMOTE_DIR="/var/www/golden-chance"

echo "==> Deploying to $SSH_USER@$SERVER_IP"
echo "==> Remote directory: $REMOTE_DIR"

SSH_OPTS="-o StrictHostKeyChecking=no -i $SSH_KEY"

# Create remote directory if it doesn't exist
ssh $SSH_OPTS "$SSH_USER@$SERVER_IP" "mkdir -p $REMOTE_DIR"

# Sync files to server (exclude unnecessary files)
echo "==> Syncing files..."
rsync -az --delete \
  --exclude='.git' \
  --exclude='.github' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.env.local' \
  -e "ssh $SSH_OPTS" \
  . "$SSH_USER@$SERVER_IP:$REMOTE_DIR/"

# Run remote deploy
echo "==> Running remote deploy script..."
ssh $SSH_OPTS "$SSH_USER@$SERVER_IP" bash -s << 'EOF'
set -euo pipefail
cd /var/www/golden-chance
chmod +x scripts/remote-deploy.sh
./scripts/remote-deploy.sh
EOF

echo ""
echo "==> Deployment complete!"
echo "==> Live at: http://$SERVER_IP"
