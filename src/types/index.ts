/**
 * PSGC Types - Barrel exports for all type definitions
 */

// Export interfaces and types from psgc.types
export type {
  GeographicEntity,
  IslandGroup,
  Region,
  Province,
  District,
  City,
  Municipality,
  SubMunicipality,
  CityMunicipality,
  Barangay,
  PSGCApiResponse,
  PSGCApiError,
  GeographicHierarchy,
  SearchResult,
  // Parameter types from psgc.types (interfaces)
  IslandGroupParams as IslandGroupParamsInterface,
  RegionParams as RegionParamsInterface,
  ProvinceParams as ProvinceParamsInterface,
  DistrictParams as DistrictParamsInterface,
  CityParams as CityParamsInterface,
  MunicipalityParams as MunicipalityParamsInterface,
  SubMunicipalityParams as SubMunicipalityParamsInterface,
  CityMunicipalityParams as CityMunicipalityParamsInterface,
  BarangayParams as BarangayParamsInterface,
  SearchByNameParams as SearchByNameParamsInterface,
  ValidateCodeParams as ValidateCodeParamsInterface,
  GetHierarchyParams as GetHierarchyParamsInterface,
} from './psgc.types';

// Export validation schemas and their inferred types (preferred)
export {
  IslandGroupCodeSchema,
  RegionCodeSchema,
  ProvinceCodeSchema,
  DistrictCodeSchema,
  CityCodeSchema,
  MunicipalityCodeSchema,
  SubMunicipalityCodeSchema,
  CityMunicipalityCodeSchema,
  BarangayCodeSchema,
  EntityTypeSchema,
  // Parameter schemas
  IslandGroupParamsSchema,
  RegionParamsSchema,
  ProvinceParamsSchema,
  DistrictParamsSchema,
  CityParamsSchema,
  MunicipalityParamsSchema,
  SubMunicipalityParamsSchema,
  CityMunicipalityParamsSchema,
  BarangayParamsSchema,
  SearchByNameParamsSchema,
  ValidateCodeParamsSchema,
  GetHierarchyParamsSchema,
  // Response schemas
  IslandGroupSchema,
  RegionSchema,
  ProvinceSchema,
  DistrictSchema,
  CitySchema,
  MunicipalitySchema,
  SubMunicipalitySchema,
  CityMunicipalitySchema,
  BarangaySchema,
  IslandGroupsResponseSchema,
  RegionsResponseSchema,
  ProvincesResponseSchema,
  DistrictsResponseSchema,
  CitiesResponseSchema,
  MunicipalitiesResponseSchema,
  SubMunicipalitiesResponseSchema,
  CityMunicipalitiesResponseSchema,
  BarangaysResponseSchema,
} from './validation.schemas';

// Export inferred types from validation schemas (these are the preferred types to use)
export type {
  IslandGroupCode,
  EntityType,
  IslandGroupParams,
  RegionParams,
  ProvinceParams,
  DistrictParams,
  CityParams,
  MunicipalityParams,
  SubMunicipalityParams,
  CityMunicipalityParams,
  BarangayParams,
  SearchByNameParams,
  ValidateCodeParams,
  GetHierarchyParams,
} from './validation.schemas';

// Export constants
export {
  API_CONFIG,
  GEOGRAPHIC_CODES,
  ENTITY_TYPES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  CONTENT_TYPES,
  CACHE_KEYS,
  RATE_LIMITS,
  PAGINATION,
} from './constants';

// Export API types
export type {
  PSGCError,
  ApiResponse,
  CacheConfig,
  RateLimitConfig,
  RetryConfig,
  ContentType,
  ApiEndpoint,
  HttpMethod,
  RequestOptions,
} from './api.types';
