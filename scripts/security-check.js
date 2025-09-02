#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Lista de padrões de segredos a serem verificados
const secretPatterns = [
  {
    pattern: /(['"])[0-9a-f]{32,}\1/i,
    description: "API keys genéricas",
    ignorePatterns: [
      /test/i,
      /mock/i,
      /example/i,
    ],
  },
  {
    pattern:
      /(['"])[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\1/i,
    description: "UUIDs",
    ignorePatterns: [
      /test/i,
      /mock/i,
      /example/i,
    ],
  },
  {
    pattern: /(['"])[a-z0-9]{40}\1/i,
    description: "Tokens do GitHub",
    ignorePatterns: [
      /test/i,
      /mock/i,
      /example/i,
    ],
  },
  {
    pattern: /(['"])[a-z0-9/+]{40,}\1/i,
    description: "Tokens Base64",
    ignorePatterns: [
      /0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789/i, // Endereço do contrato EntryPoint
      /test/i,
      /mock/i,
      /example/i,
      /qrcode/i,
      /base64/i,
    ],
  },
  {
    pattern: /(['"])[0-9]{16,}\1/,
    description: "Números longos (possíveis tokens)",
    ignorePatterns: [
      /test/i,
      /mock/i,
      /example/i,
    ],
  },
  {
    pattern: /password\s*[:=]\s*['"][^'"]+['"]/i,
    description: "Senhas hardcoded",
    ignorePatterns: [
      /test/i,
      /mock/i,
      /example/i,
    ],
  },
  {
    pattern: /secret\s*[:=]\s*['"][^'"]+['"]/i,
    description: "Segredos hardcoded",
    ignorePatterns: [
      /test/i,
      /mock/i,
      /example/i,
    ],
  },
  {
    pattern: /key\s*[:=]\s*['"][^'"]+['"]/i,
    description: "Chaves hardcoded",
    ignorePatterns: [
      /VITE_MERCADO_PAGO_PUBLIC_KEY/i,
      /VITE_GA_MEASUREMENT_ID/i,
      /VITE_PRIVY_APP_ID/i,
      /test/i,
      /mock/i,
      /example/i,
      /publicKey/i,
      /keyframes/i,
    ],
  },
];

// Lista de extensões de arquivo a serem verificadas
const fileExtensions = [".ts", ".tsx", ".js", ".jsx", ".json", ".env"];

// Lista de diretórios a serem ignorados
const ignoreDirs = ["node_modules", "dist", "build", "coverage", "assets", "__tests__", "test-data", "temp_backup", "features/step_definitions"];

// Função para verificar se um arquivo deve ser ignorado
function shouldIgnoreFile(filePath) {
  return ignoreDirs.some((dir) => filePath.includes(`/${dir}/`));
}

// Função para verificar se uma linha deve ser ignorada
function shouldIgnoreLine(line, ignorePatterns) {
  return ignorePatterns.some((pattern) => pattern.test(line));
}

// Função para verificar um arquivo em busca de segredos
function checkFileForSecrets(filePath) {
  if (shouldIgnoreFile(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, "utf8");
  const findings = [];

  secretPatterns.forEach(({ pattern, description, ignorePatterns }) => {
    const lines = content.split("\n");
    let matches = 0;

    lines.forEach((line) => {
      if (pattern.test(line) && !shouldIgnoreLine(line, ignorePatterns)) {
        matches++;
      }
    });

    if (matches > 0) {
      findings.push({
        file: filePath,
        pattern: pattern.toString(),
        description,
        matches,
      });
    }
  });

  return findings;
}

// Função para obter arquivos modificados no git
function getModifiedFiles() {
  try {
    const output = execSync("git diff --cached --name-only").toString();
    return output.split("\n").filter(Boolean);
  } catch (error) {
    console.error("Erro ao obter arquivos modificados:", error);
    return [];
  }
}

// Função principal
function main() {
  const modifiedFiles = getModifiedFiles();
  const findings = [];

  modifiedFiles.forEach((file) => {
    if (fileExtensions.some((ext) => file.endsWith(ext))) {
      const fileFindings = checkFileForSecrets(file);
      findings.push(...fileFindings);
    }
  });

  if (findings.length > 0) {
    console.error("\nPossíveis segredos encontrados:");
    findings.forEach((finding) => {
      console.error(`\nArquivo: ${finding.file}`);
      console.error(`Tipo: ${finding.description}`);
      console.error(`Padrão: ${finding.pattern}`);
      console.error(`Ocorrências: ${finding.matches}`);
    });
    process.exit(1);
  } else {
    console.log("✅ Nenhum segredo encontrado nos arquivos modificados.");
    process.exit(0);
  }
}

main();
