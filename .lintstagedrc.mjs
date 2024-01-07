export default {
  "{apps,packages,.github}/**/*.{yaml,yml}": ["prettier --write", "git add"],
  "pnpm-workspace.yaml": ["prettier --write", "git add"],
  "*.{css}": ["prettier --write", "git add"],
  "*.{mjs,json}": ["prettier --write", "git add"],
  "*.{html}": ["prettier --write", "git add"],
  "*.{js,jsx,ts,tsx,cjs,mjs,md}": ["prettier --write --list-different", "git add"],
  "{apps,packages}/**/*.{js,jsx,ts,tsx,cjs,mjs,md}": ["prettier --write --list-different", "eslint --fix", "git add"],
};
