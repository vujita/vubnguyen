# vubnguyen

- This is a mono repo is inspired from [t3](https://create.t3.gg/) stackand
- The major deviation is using [turborepo](https://turbo.build/) for a mono repo setup for future project extensions

## Installation

There are 2 prescribed way of running this repository, either with [github codespaces](https://github.com/features/codespaces)

### github codespaces

Github codespaces can be running locally
- Install [docker](https://www.docker.com/). [Instructions on mac](https://docs.docker.com/desktop/install/mac-install/#install-and-run-docker-desktop-on-mac)
- Install [vscode](https://code.visualstudio.com/)
- Open in this folder in a [devcontainers](https://code.visualstudio.com/docs/devcontainers/containers)

You can also run it in the repository by creating a code space off a branch

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
### First run after launching codespace

```diff
# Install dependencies (this should be done by initialization script)
pnpm i

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Prisma schema to your database
pnpm db:push
```
## Deployment

TODO: buy a domain and setup with vercel
