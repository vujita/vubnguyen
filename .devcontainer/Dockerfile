FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install vim tmux exa chromium

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install v18.16.0"

RUN npx playwright install
RUN npx playwright install-deps

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"
RUN npm install -g @xarc/run-cli

RUN	curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim.appimage && \
		chmod u+x nvim.appimage && \
		./nvim.appimage --appimage-extract && \
		./squashfs-root/AppRun --version
