## An eslint set of presets

## Installation

```bash
  npm install --save-dev eslint-config-vujita
  # or
  yarn add --save-dev eslint-config-vujita
  # or
  pnpm add --save-dev eslint-config-vujita
```

## Presets

- base
  A set of presets for all javascript/typescript
- react
  A set of presets for react
- next
  A set of presets for next apps

## Add to your config

In your package json

```
   "eslintConfig": {
    "root": true,
    "extends": [
      "eslint-config-vujita/base"
    ]
  }

```

`.esltintrc.js`

```javascript
  module.exports = {
    extends: ['vujita/base', 'vujita/react','vujita/next'],
    rules: {
      /* custom rules */
    },

```
