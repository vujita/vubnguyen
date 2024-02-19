#!/bin/zsh

echo "post install script"
pnpm install
apt install chromium -y
pnpm playwright install
pnpm playwright install-deps
cp .env.example .env
pnpm run db:migrate
chmod +x ./codespace-postinstall.sh
# pnpm run db:push
