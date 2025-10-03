import securityPlugin from "eslint-plugin-security";

export default [
  {
    plugins: {
      security: securityPlugin,
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

      // Regras de segurança para TypeScript
      // As regras específicas do TypeScript são cobertas pelo plugin de segurança padrão
      // e pelas regras do @typescript-eslint

      // Regras padrão do TypeScript
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-this-alias": "off",
    },
  },
];
