// Global test setup
import { vi } from 'vitest';

// Mock environment variables
vi.mock('../src/utils/config.js', () => ({
  getConfig: vi.fn(() => ({
    api: {
      baseUrl: 'https://psgc.gitlab.io/api',
    },
    server: {
      port: 3000,
    },
    cache: {
      ttl: 3600,
    },
    logging: {
      level: 'info',
    },
  })),
}));
