/**
 * Environment configuration for PSGC MCP Server
 */

import { API_CONFIG } from '../types/index.js';

export interface Config {
  api: {
    baseUrl: string;
  };
  server: {
    port: number;
  };
  cache: {
    ttl: number;
  };
  logging: {
    level: string;
  };
}

const DEFAULT_CONFIG: Config = {
  api: {
    baseUrl: API_CONFIG.BASE_URL,
  },
  server: {
    port: 3000,
  },
  cache: {
    ttl: Math.floor(API_CONFIG.CACHE_TTL / 1000), // Convert from milliseconds to seconds
  },
  logging: {
    level: 'info',
  },
};

export function getConfig(): Config {
  return {
    api: {
      baseUrl: process.env.PSGC_API_URL || DEFAULT_CONFIG.api.baseUrl,
    },
    server: {
      port: parseInt(process.env.PORT || String(DEFAULT_CONFIG.server.port), 10),
    },
    cache: {
      ttl: parseInt(process.env.CACHE_TTL || String(DEFAULT_CONFIG.cache.ttl), 10),
    },
    logging: {
      level: process.env.LOG_LEVEL || DEFAULT_CONFIG.logging.level,
    },
  };
}
