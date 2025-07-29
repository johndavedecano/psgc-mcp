import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { CacheConfig } from '../types/api.types';

/**
 * Cache service for storing API responses
 */
export class CacheService {
  private memoryCache = new Map<string, { data: unknown; timestamp: number }>();
  private config: CacheConfig;
  private cacheDir: string;

  constructor(config: CacheConfig) {
    this.config = config;
    this.cacheDir = path.join(os.tmpdir(), 'psgc-mcp-cache');
  }

  /**
   * Initialize cache directory
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.warn('Failed to create cache directory:', error);
    }
  }

  /**
   * Generate cache key
   */
  private generateKey(endpoint: string): string {
    return Buffer.from(endpoint).toString('base64').replace(/[/+=]/g, '_');
  }

  /**
   * Check if cache entry is valid
   */
  private isValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.config.ttl;
  }

  /**
   * Get data from cache
   */
  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && this.isValid(memoryEntry.timestamp)) {
      return memoryEntry.data as T;
    }

    // Check disk cache if persist is enabled
    if (this.config.persist) {
      try {
        const filePath = path.join(this.cacheDir, this.generateKey(key));
        const data = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(data);

        if (this.isValid(parsed.timestamp)) {
          // Update memory cache
          this.memoryCache.set(key, parsed);
          return parsed.data as T;
        } else {
          // Remove expired cache file
          await fs.unlink(filePath);
        }
      } catch (error) {
        // File doesn't exist or is invalid
      }
    }

    return null;
  }

  /**
   * Store data in cache
   */
  async set<T>(key: string, data: T): Promise<void> {
    const entry = { data, timestamp: Date.now() };

    // Store in memory cache
    this.memoryCache.set(key, entry);

    // Store in disk cache if persist is enabled
    if (this.config.persist) {
      try {
        const filePath = path.join(this.cacheDir, this.generateKey(key));
        await fs.writeFile(filePath, JSON.stringify(entry));
      } catch (error) {
        console.warn('Failed to write cache file:', error);
      }
    }

    // Enforce max size limit
    if (this.config.maxSize && this.memoryCache.size > this.config.maxSize) {
      this.cleanup();
    }
  }

  /**
   * Remove specific cache entry
   */
  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);

    if (this.config.persist) {
      try {
        const filePath = path.join(this.cacheDir, this.generateKey(key));
        await fs.unlink(filePath);
      } catch (error) {
        // File doesn't exist
      }
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();

    if (this.config.persist) {
      try {
        const files = await fs.readdir(this.cacheDir);
        await Promise.all(files.map((file) => fs.unlink(path.join(this.cacheDir, file))));
      } catch (error) {
        console.warn('Failed to clear cache directory:', error);
      }
    }
  }

  /**
   * Clean up expired cache entries
   */
  async cleanup(): Promise<void> {
    const now = Date.now();

    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry.timestamp)) {
        this.memoryCache.delete(key);
      }
    }

    // Clean disk cache
    if (this.config.persist) {
      try {
        const files = await fs.readdir(this.cacheDir);
        await Promise.all(
          files.map(async (file) => {
            const filePath = path.join(this.cacheDir, file);
            try {
              const data = await fs.readFile(filePath, 'utf-8');
              const parsed = JSON.parse(data);
              if (!this.isValid(parsed.timestamp)) {
                await fs.unlink(filePath);
              }
            } catch (error) {
              // Invalid file, remove it
              await fs.unlink(filePath);
            }
          })
        );
      } catch (error) {
        console.warn('Failed to cleanup cache directory:', error);
      }
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    memoryEntries: number;
    diskEntries: number;
    totalSize: number;
  }> {
    let diskEntries = 0;

    if (this.config.persist) {
      try {
        const files = await fs.readdir(this.cacheDir);
        diskEntries = files.length;
      } catch (error) {
        // Directory doesn't exist
      }
    }

    return {
      memoryEntries: this.memoryCache.size,
      diskEntries,
      totalSize: this.memoryCache.size + diskEntries,
    };
  }
}

// Export singleton instance
export const cacheService = new CacheService({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000, // Maximum 1000 entries
  persist: true, // Persist to disk
});
