import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PSGCClient, PSGCApiError } from '../../../src/services/psgc-client';

describe('PSGCClient', () => {
  let client: PSGCClient;

  beforeEach(() => {
    client = new PSGCClient({
      baseURL: 'https://psgc.gitlab.io/api',
      timeout: 5000,
      retries: 1,
      cacheTTL: 1000, // 1 second for testing
    });
  });

  afterEach(() => {
    client.clearCache();
    vi.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should use default configuration when none provided', () => {
      const defaultClient = new PSGCClient();
      expect(defaultClient).toBeDefined();
    });

    it('should use custom configuration when provided', () => {
      const customClient = new PSGCClient({
        baseURL: 'https://custom.api',
        timeout: 10000,
        retries: 5,
      });
      expect(customClient).toBeDefined();
    });
  });

  describe('Cache Management', () => {
    it('should cache responses', async () => {
      // Mock the actual API call since we don't want to hit the real API in tests
      const mockData = [{ code: 'luzon', name: 'Luzon' }];

      // We'll test the cache functionality without making real API calls
      const cacheKey = 'psgc:/island-groups.json';
      client['setCache'](cacheKey, mockData);

      const cached = client['getFromCache'](cacheKey);
      expect(cached).toEqual(mockData);
    });

    it('should clear cache', () => {
      const cacheKey = 'psgc:/test.json';
      client['setCache'](cacheKey, { test: 'data' });

      expect(client['getFromCache'](cacheKey)).toBeDefined();

      client.clearCache();
      expect(client['getFromCache'](cacheKey)).toBeNull();
    });

    it('should return cache statistics', () => {
      const stats = client.getCacheStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('entries');
      expect(Array.isArray(stats.entries)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should create PSGCApiError with correct properties', () => {
      const error = new PSGCApiError('Test error', 404, '/test/endpoint');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.endpoint).toBe('/test/endpoint');
      expect(error.name).toBe('PSGCApiError');
    });
  });

  describe('Cache Key Generation', () => {
    it('should generate consistent cache keys', () => {
      const endpoint1 = '/island-groups.json';
      const endpoint2 = '/island-groups.json';

      const key1 = client['getCacheKey'](endpoint1);
      const key2 = client['getCacheKey'](endpoint2);

      expect(key1).toBe(key2);
      expect(key1).toBe('psgc:/island-groups.json');
    });
  });

  describe('Cache Validation', () => {
    it('should validate cache entries correctly', () => {
      const validTimestamp = Date.now();
      const expiredTimestamp = Date.now() - 2000; // 2 seconds ago

      expect(client['isCacheValid'](validTimestamp)).toBe(true);

      // With 1 second TTL, expired timestamp should be invalid
      expect(client['isCacheValid'](expiredTimestamp)).toBe(false);
    });
  });
});
