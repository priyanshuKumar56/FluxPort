import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off"
    },
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        module: "readonly",
        exports: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly"
      }
    }
  },
  {
    ignores: [".next/*", "node_modules/*", "dist/*", "server/*"]
  }
];
