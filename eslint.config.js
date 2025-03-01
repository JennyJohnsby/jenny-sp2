import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: { ...globals.browser, __dirname: "readonly" } },
  },
  pluginJs.configs.recommended,
];
