import securityPlugin from "eslint-plugin-security";
import typescriptSecurityPlugin from "@typescript-eslint/eslint-plugin-security";

export default [
  {
    plugins: {
      security: securityPlugin,
      "@typescript-eslint/security": typescriptSecurityPlugin,
    },
    rules: {
      // Regras de segurança gerais
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "warn",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-new-buffer": "error",
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-object-injection": "warn",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-pseudoRandomBytes": "error",
      "security/detect-unsafe-regex": "error",

      // Regras de segurança específicas para TypeScript
      "@typescript-eslint/security/no-unsafe-member-access": "error",
      "@typescript-eslint/security/no-unsafe-assignment": "error",
      "@typescript-eslint/security/no-unsafe-call": "error",
      "@typescript-eslint/security/no-unsafe-return": "error",

      // Regras padrão do TypeScript
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-this-alias": "off",
    },
  },
];
