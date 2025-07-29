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
  EntityType,
  // Parameter types
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
} from './psgc.types';

// Export validation schemas
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
