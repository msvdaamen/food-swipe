import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tailwind from "eslint-plugin-tailwindcss";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Needs to be at the end
  ...tailwind.configs["flat/recommended"],
  eslintPluginPrettierRecommended,
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          plugins: ["prettier-plugin-tailwindcss"],
          tabSize: 2,
        },
      ],
    },
  },
];
