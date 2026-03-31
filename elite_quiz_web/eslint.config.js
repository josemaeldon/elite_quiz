import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";

// Helper function to trim keys in the globals object
const trimGlobalKeys = (globalSet) => {
  const trimmedGlobals = {};
  for (const key in globalSet) {
    trimmedGlobals[key.trim()] = globalSet[key];
  }
  return trimmedGlobals;
};

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "unused-imports": eslintPluginUnusedImports,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...trimGlobalKeys(globals.browser),
        ...trimGlobalKeys(globals.node),
      },
    },
    rules: {
      // Apply Next.js recommended rules (approximated for flat config)
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // Apply React recommended rules
      ...reactPlugin.configs.recommended.rules,
      // Apply React Hooks rules
      ...hooksPlugin.configs.recommended.rules,

      // Configure unused imports/vars
      "no-unused-vars": "off", // Disable base rule
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      // Add any other specific rule overrides here if needed
      "react/react-in-jsx-scope": "off", // Often not needed with modern React/Next.js
      "react/prop-types": "off", // Disable prop-types if not using them
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
  {
    // Ignores specific files or directories if needed
    ignores: [".next/", "node_modules/"],
  },
];
