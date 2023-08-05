#!/bin/zsh

echo "post install script"
pnpm install
pnpm run db:migrate:deploy