#!/bin/zsh

echo "post install script"
pnpm install
apt install chromium
pnpm playwright install
pnpm playwright install-deps
cp .env.example .env
pnpm run db:migrate
pnpm run db:push
