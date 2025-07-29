/**
 * Environment configuration for PSGC MCP Server
 */

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
    baseUrl: "https://psgc.gitlab.io/api",
  },
  server: {
    port: 3000,
  },
  cache: {
    ttl: 3600, // 1 hour in seconds
  },
  logging: {
    level: "info",
  },
};

export function getConfig(): Config {
  return {
    api: {
      baseUrl: process.env.PSGC_API_URL || DEFAULT_CONFIG.api.baseUrl,
    },
    server: {
      port: parseInt(
        process.env.PORT || String(DEFAULT_CONFIG.server.port),
        10
      ),
    },
    cache: {
      ttl: parseInt(
        process.env.CACHE_TTL || String(DEFAULT_CONFIG.cache.ttl),
        10
      ),
    },
    logging: {
      level: process.env.LOG_LEVEL || DEFAULT_CONFIG.logging.level,
    },
  };
}
