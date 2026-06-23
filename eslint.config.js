const { FlatCompat } = require("@eslint/eslintrc")
const vemiqIconsPlugin = require("./eslint-plugin-vemiq-icons")
const vemiqDesignSystemPlugin = require("./eslint-plugin-vemiq-design-system")
const nextPlugin = require("eslint-plugin-next")

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

module.exports = [
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      "vemiq-icons": vemiqIconsPlugin,
      "vemiq-design-system": vemiqDesignSystemPlugin,
    },
    rules: {
      "vemiq-icons/no-raw-icon-imports": "error",
      "vemiq-design-system/no-raw-css-values": "error",
      "vemiq-design-system/prefer-design-system-components": "error",
      "vemiq-design-system/prefer-layout-primitives": "error",
    },
  },
]
