module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom', // Certifique-se que isso está definido corretamente
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy" // Adiciona mapeamento para arquivos CSS
  }
};
