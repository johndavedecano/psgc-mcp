/**
 * Shared constants and configuration for PSGC API
 */

// API Configuration
export const API_CONFIG = {
  /** Base URL for PSGC API */
  BASE_URL: 'https://psgc.gitlab.io/api',
  /** Default timeout for API requests (in milliseconds) */
  DEFAULT_TIMEOUT: 30000,
  /** Maximum retry attempts for failed requests */
  MAX_RETRIES: 3,
  /** Retry delay (in milliseconds) */
  RETRY_DELAY: 1000,
  /** Cache TTL (in milliseconds) */
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const;

// Geographic entity codes and patterns
export const GEOGRAPHIC_CODES = {
  /** Valid island group codes */
  ISLAND_GROUPS: ['luzon', 'visayas', 'mindanao'] as const,

  /** Code pattern constants */
  PATTERNS: {
    /** 9-digit numeric code */
    NINE_DIGIT: /^\d{9}$/,
    /** 9-digit code ending with 6 zeros (regions, provinces, districts) */
    SIX_ZEROS: /^\d{3}000000$/,
    /** 9-digit code ending with 3 zeros (cities, municipalities, sub-municipalities) */
    THREE_ZEROS: /^\d{6}000$/,
    /** 9-digit code with no specific pattern (barangays) */
    BARANGAY: /^\d{9}$/,
  },

  /** Code prefixes for different entity types */
  PREFIXES: {
    REGION: '000000000',
    PROVINCE: '000000000',
    DISTRICT: '000000000',
    CITY: '000000000',
    MUNICIPALITY: '000000000',
    SUB_MUNICIPALITY: '000000000',
    BARANGAY: '000000000',
  },
} as const;

// Entity type mappings
export const ENTITY_TYPES = {
  ISLAND_GROUP: 'island-group',
  REGION: 'region',
  PROVINCE: 'province',
  DISTRICT: 'district',
  CITY: 'city',
  MUNICIPALITY: 'municipality',
  CITY_MUNICIPALITY: 'city-municipality',
  SUB_MUNICIPALITY: 'sub-municipality',
  BARANGAY: 'barangay',
} as const;

// API endpoint mappings
export const API_ENDPOINTS = {
  ISLAND_GROUPS: '/island-groups.json',
  REGIONS: '/regions.json',
  PROVINCES: '/provinces.json',
  DISTRICTS: '/districts.json',
  CITIES: '/cities.json',
  MUNICIPALITIES: '/municipalities.json',
  SUB_MUNICIPALITIES: '/sub-municipalities.json',
  CITIES_MUNICIPALITIES: '/cities-municipalities.json',
  BARANGAYS: '/barangays.json',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_CODE_FORMAT: 'Invalid code format',
  INVALID_ISLAND_GROUP: 'Invalid island group code. Must be one of: luzon, visayas, mindanao',
  INVALID_REGION_CODE: 'Invalid region code format. Must be 9 digits ending with 6 zeros',
  INVALID_PROVINCE_CODE: 'Invalid province code format. Must be 9 digits ending with 6 zeros',
  INVALID_DISTRICT_CODE: 'Invalid district code format. Must be 9 digits ending with 6 zeros',
  INVALID_CITY_CODE: 'Invalid city code format. Must be 9 digits ending with 3 zeros',
  INVALID_MUNICIPALITY_CODE:
    'Invalid municipality code format. Must be 9 digits ending with 3 zeros',
  INVALID_SUB_MUNICIPALITY_CODE:
    'Invalid sub-municipality code format. Must be 9 digits ending with 3 zeros',
  INVALID_CITY_MUNICIPALITY_CODE:
    'Invalid city/municipality code format. Must be 9 digits ending with 3 zeros',
  INVALID_BARANGAY_CODE: 'Invalid barangay code format. Must be exactly 9 digits',
  EMPTY_SEARCH_NAME: 'Search name cannot be empty',
  EMPTY_CODE: 'Code cannot be empty',
  API_TIMEOUT: 'API request timed out',
  API_ERROR: 'API request failed',
  NETWORK_ERROR: 'Network error occurred',
  NOT_FOUND: 'Entity not found',
} as const;

// Content type handling
export const CONTENT_TYPES = {
  JSON: 'application/json',
  HTML: 'text/html',
} as const;

// Cache keys
export const CACHE_KEYS = {
  ISLAND_GROUPS: 'island-groups',
  REGIONS: 'regions',
  PROVINCES: 'provinces',
  DISTRICTS: 'districts',
  CITIES: 'cities',
  MUNICIPALITIES: 'municipalities',
  SUB_MUNICIPALITIES: 'sub-municipalities',
  CITIES_MUNICIPALITIES: 'cities-municipalities',
  BARANGAYS: 'barangays',
} as const;

// Rate limiting
export const RATE_LIMITS = {
  /** Maximum requests per minute */
  MAX_REQUESTS_PER_MINUTE: 60,
  /** Maximum concurrent requests */
  MAX_CONCURRENT_REQUESTS: 10,
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const;
