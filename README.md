# vubnguyen

- This is a mono repo is inspired from [t3](https://create.t3.gg/) stackand
- The major deviation is using [turborepo](https://turbo.build/) for a mono repo setup for future project extensions

## Installation

There are 2 prescribed way of running this repository, either with [github codespaces](https://github.com/features/codespaces) or locally

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

## sso setup

- Discrd: [create a discord application](https://discord.com/developers/applications) and add client/secret to your .env file

## Folder structure

```
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ next.js
      ├─ Next.js 13
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v10 router definition
  ├─ auth
  |   └─ Authentication using next-auth. **NOTE: Only for Next.js app, not Expo**
  ├─ config
  |   └─ Shared Tailwind & Eslint configs
  └─ db
      └─ Typesafe db calls using Prisma
```

## Deployment
[vubnguyen.com](https://vubnguyen.com)
