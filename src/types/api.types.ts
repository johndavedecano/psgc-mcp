/**
 * API response types and error handling
 */

/**
 * Base API error interface
 */
export interface PSGCError {
  message: string;
  statusCode?: number;
  endpoint?: string;
  details?: unknown;
}

/**
 * API response wrapper for consistent error handling
 */
export type ApiResponse<T> = { success: true; data: T } | { success: false; error: PSGCError };

/**
 * Cache configuration interface
 */
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  persist?: boolean; // Whether to persist to disk
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}

/**
 * Content type handling
 */
export type ContentType = 'application/json' | 'text/html';

/**
 * API endpoint mapping
 */
export type ApiEndpoint =
  | 'island-groups'
  | 'regions'
  | 'provinces'
  | 'districts'
  | 'cities'
  | 'municipalities'
  | 'sub-municipalities'
  | 'cities-municipalities'
  | 'barangays';

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Request options
 */
export interface RequestOptions {
  useCache?: boolean;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}
