import { describe, it, expect } from 'vitest';
import { getConfig } from '../../../src/utils/config.js';

describe('Config', () => {
  describe('getConfig', () => {
    it('should return default configuration when no environment variables are set', () => {
      const config = getConfig();

      expect(config).toHaveProperty('api');
      expect(config.api.baseUrl).toBe('https://psgc.gitlab.io/api');
    });

    it('should use environment variable when PSGC_API_URL is set', () => {
      process.env.PSGC_API_URL = 'https://custom-api.example.com';

      const config = getConfig();

      expect(config.api.baseUrl).toBe('https://custom-api.example.com');

      // Clean up
      delete process.env.PSGC_API_URL;
    });

    it('should use default port when PORT is not set', () => {
      const config = getConfig();

      expect(config.server.port).toBe(3000);
    });

    it('should use custom port when PORT is set', () => {
      process.env.PORT = '8080';

      const config = getConfig();

      expect(config.server.port).toBe(8080);

      // Clean up
      delete process.env.PORT;
    });
  });
});
