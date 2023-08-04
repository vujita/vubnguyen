export default {
  "*.{mjs,json}": ["prettier --write", "git add"],
  "*.{js,jsx,ts,tsx,md}": ["prettier --write --list-different", "git add"],
  "{apps,packages}/**/*.{js,jsx,ts,tsx,mjs,md}": ["prettier --write --list-different", "eslint --fix", "git add"],
};
