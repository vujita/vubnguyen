# [vubnguyen.com](https://vubnguyen.com)

[![CI](https://github.com/vujita/vubnguyen/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/vujita/vubnguyen/actions/workflows/ci.yml)
[![prisma migrate](https://github.com/vujita/vubnguyen/actions/workflows/prisma-migrations.yml/badge.svg)](https://github.com/vujita/vubnguyen/actions/workflows/prisma-migrations.yml)
[![wakatime](https://wakatime.com/badge/github/vujita/vubnguyen.svg)](https://wakatime.com/badge/github/vujita/vubnguyen)

A [storybook](https://vujita.github.io/vubnguyen/) instance is demo of created components by [vujita-ui](https://www.npmjs.com/package/vujita-ui)

## Inspiration

This is a mono repo is inspired from [t3](https://create.t3.gg/) stack.
The major deviation is using [turborepo](https://turbo.build/) for a mono repo setup for future project extensions

I also want to be able to host my personal portfolio site and any packages that.

I may want to publish for future use in other projects, like

- eslint-config
- common utilities
- any ui libraries I may create

## Installation

There are 2 prescribed way of running this repository, either with [github codespaces](https://github.com/features/codespaces) or locally

<!-- TODO: Add more visuals to this -->

### github codespaces

Github codespaces can be running locally

- Install [docker](https://www.docker.com/). [Instructions on mac](https://docs.docker.com/desktop/install/mac-install/#install-and-run-docker-desktop-on-mac)
- Install [vscode](https://code.visualstudio.com/)
- Open in this folder in a [devcontainers](https://code.visualstudio.com/docs/devcontainers/containers)

You can also run it in the repository by creating a code space off a branch, or locally using devcontainer extension if you have docker installed

### local setup

Install [nvm](https://github.com/nvm-sh/nvm), and run

```bash
  nvm install
  nvm use
  corepack enable
  corepack prepare pnpm@8.6.9 --activate
  pnpm install-completion # optional but will give you autocompletion
```

Install [postgres](https://www.postgresql.org/) version 14

## Environment, node modules, and db sync

```diff
# Install dependencies (this should be done by initialization script)
pnpm i

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Prisma schema to your database
pnpm db:push
```

## auth setup

- Discord: [create a discord application](https://discord.com/developers/applications) and add client/secret to your .env file

## Folder structure

```
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ vubnguyen
  |   ├─ Next.js 13
  |   ├─ React 18
  |   ├─ Tailwind CSS
  |   └─ E2E Typesafe API Server & Client
  └─ storybook
      └─ storybook to demo
packages
  ├─ api
  |   └─ tRPC v10 router definition
  ├─ auth
  |   └─ Authentication using next-auth. **NOTE: Only for Next.js app, not Expo**
  ├─ config
  |   └─ Shared Tailwind & Eslint configs
  └─ db
  |  └─ Typesafe db calls using Prisma
  └─ vujita-ui
      └─ A ui library based on React/Tailwind/Class Variance Authority
      └─ TBA....
```
