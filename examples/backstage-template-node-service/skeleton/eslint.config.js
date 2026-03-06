// ESLint Flat Config for Node Service Template
import js from "@eslint/js";

export default [
  {
    ignores: ["node_modules/**", "coverage/**", "dist/**", "site/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js", "tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        require: "readonly",
        module: "readonly",
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "off",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
    },
  },
  {
    files: ["tests/**/*.js"],
    rules: {
      // test-specific overrides if needed
    },
  },
];
