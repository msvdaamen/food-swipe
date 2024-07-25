// import typescriptEslint from "@typescript-eslint/eslint-plugin";
// import solid from "eslint-plugin-solid";
// import globals from "globals";
// import tsParser from "@typescript-eslint/parser";
// import prettier from "eslint-plugin-prettier";
// import prettierConfig from "eslint-config-prettier";

// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Needs to be at the end
  eslintPluginPrettierRecommended,
];
