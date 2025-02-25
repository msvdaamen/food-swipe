import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // {
  //   // recommended configuration included in the plugin
  //   ...html.configs["flat/recommended"],
  //   files: ["**/*.html"],
  //   rules: {
  //     ...html.configs["flat/recommended"].rules, // Must be defined. If not, all recommended rules will be lost
  //     "@html-eslint/indent": "off",
  //   },
  // },

  // Needs to be at the end
  eslintPluginPrettierRecommended,
];
