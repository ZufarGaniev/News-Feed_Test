export default {
  // 1) эмулируем браузерную среду через отдельный пакет
  testEnvironment: 'jest-environment-jsdom', // :contentReference[oaicite:0]{index=0}

  // 2) транспиляция ES-модулей (.js / .jsx) через Babel
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // :contentReference[oaicite:1]{index=1}
  },

  // 3) подключаем глобальные матчер‑расширения из @testing-library/jest-dom
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // :contentReference[oaicite:2]{index=2}

  // 4) шаблоны для поиска тестовых файлов
  testMatch: ['**/__tests__/**/*.(spec|test).[jt]s?(x)'], // :contentReference[oaicite:3]{index=3}

  // 5) папка и порог для покрытия
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
