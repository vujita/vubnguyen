#!/bin/zsh

echo "post install script"
pnpm install
cp .env.example .env
pnpm run db:migrate:deploy
