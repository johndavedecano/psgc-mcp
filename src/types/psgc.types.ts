/**
 * PSGC (Philippine Standard Geographic Code) Data Types
 * Based on the official PSGC API OpenAPI specification from https://psgc.gitlab.io/api/docs.json
 */

import type { EntityType } from './validation.schemas';

// Base interface for all geographic entities
export interface GeographicEntity {
  /** Unique code identifier */
  readonly code: string;
  /** Official name of the entity */
  readonly name: string;
}

// Island Group Types
export interface IslandGroup extends GeographicEntity {
  /** Island group identifier (lowercase) */
  readonly code: 'luzon' | 'visayas' | 'mindanao';
}

// Region Types
export interface Region extends GeographicEntity {
  /** 9-digit region code ending with 6 zeros */
  readonly code: string;
  /** Short region name (e.g., "NCR") */
  readonly regionName?: string;
  /** Island group this region belongs to */
  readonly islandGroupCode: IslandGroup['code'];
}

// Province Types
export interface Province extends GeographicEntity {
  /** 9-digit province code ending with 6 zeros */
  readonly code: string;
  /** Region code this province belongs to */
  readonly regionCode: string;
  /** Island group this province belongs to */
  readonly islandGroupCode: IslandGroup['code'];
}

// District Types
export interface District extends GeographicEntity {
  /** 9-digit district code ending with 6 zeros */
  readonly code: string;
  /** Region code this district belongs to */
  readonly regionCode: string;
  /** Island group this district belongs to */
  readonly islandGroupCode: IslandGroup['code'];
}

// Municipality Types
export interface Municipality extends GeographicEntity {
  /** 9-digit municipality code ending with 3 zeros */
  readonly code: string;
  /** Previous name of the municipality */
  readonly oldName?: string;
  /** Whether this is the provincial capital */
  readonly isCapital?: boolean;
  /** District code (if applicable) */
  readonly districtCode?: string | boolean;
  /** Province code this municipality belongs to */
  readonly provinceCode: string | boolean;
  /** Region code this municipality belongs to */
  readonly regionCode: string;
  /** Island group this municipality belongs to */
  readonly islandGroupCode: IslandGroup['code'];
}

// City Types
export interface City extends GeographicEntity {
  /** 9-digit city code ending with 3 zeros */
  readonly code: string;
  /** Previous name of the city */
  readonly oldName?: string;
  /** Whether this is the provincial capital */
  readonly isCapital?: boolean;
  /** District code (if applicable) */
  readonly districtCode?: string | boolean;
  /** Province code this city belongs to */
  readonly provinceCode: string | boolean;
  /** Region code this city belongs to */
  readonly regionCode: string;
  /** Island group this city belongs to */
  readonly islandGroupCode: IslandGroup['code'];
}

// Combined City/Municipality Types
export interface CityMunicipality extends GeographicEntity {
  /** 9-digit city/municipality code ending with 3 zeros */
  readonly code: string;
  /** Previous name */
  readonly oldName?: string;
  /** Whether this is the provincial capital */
  readonly isCapital?: boolean;
  /** Whether this is a city */
  readonly isCity?: boolean;
  /** Whether this is a municipality */
  readonly isMunicipality?: boolean;
  /** District code (if applicable) */
  readonly districtCode?: string | boolean;
  /** Province code this city/municipality belongs to */
  readonly provinceCode: string | boolean;
  /** Region code this city/municipality belongs to */
  readonly regionCode: string;
  /** Island group this city/municipality belongs to */
  readonly islandGroupCode: IslandGroup['code'];
}

// Sub-Municipality Types
export interface SubMunicipality extends GeographicEntity {
  /** 9-digit sub-municipality code ending with 3 zeros */
  readonly code: string;
  /** Previous name */
  readonly oldName?: string;
  /** District code (if applicable) */
  readonly districtCode?: string | boolean;
  /** Province code this sub-municipality belongs to */
  readonly provinceCode: string | boolean;
  /** Region code this sub-municipality belongs to */
  readonly regionCode: string;
  /** Island group this sub-municipality belongs to */
  readonly islandGroupCode: IslandGroup['code'];
}

// Barangay Types
export interface Barangay extends GeographicEntity {
  /** 9-digit barangay code */
  readonly code: string;
  /** Previous name */
  readonly oldName?: string;
  /** Sub-municipality code (if applicable) */
  readonly subMunicipalityCode?: string | boolean;
  /** City code (if applicable) */
  readonly cityCode?: string | boolean;
  /** Municipality code (if applicable) */
  readonly municipalityCode?: string | boolean;
  /** District code (if applicable) */
  readonly districtCode?: string | boolean;
  /** Province code this barangay belongs to */
  readonly provinceCode: string;
  /** Region code this barangay belongs to */
  readonly regionCode: string;
  /** Island group this barangay belongs to */
  readonly islandGroupCode: IslandGroup['code'];
}

// API Response Types
export type PSGCApiResponse<T> = T[];

// Error Response Types
export interface PSGCApiError {
  /** Error message */
  readonly message: string;
  /** HTTP status code */
  readonly statusCode: number;
  /** Error details */
  readonly details?: Record<string, unknown>;
}

// Geographic Hierarchy Types
export interface GeographicHierarchy {
  /** Complete hierarchy from barangay to island group */
  readonly barangay?: Barangay;
  readonly cityMunicipality?: CityMunicipality;
  readonly subMunicipality?: SubMunicipality;
  readonly province?: Province;
  readonly district?: District;
  readonly region?: Region;
  readonly islandGroup?: IslandGroup;
}

// Search Types
export interface SearchResult {
  /** Found entity */
  readonly entity: GeographicEntity;
  /** Entity type */
  readonly type: EntityType;
  /** Relevance score for search results */
  readonly score?: number;
}

// EntityType is now imported from validation.schemas.ts to ensure consistency

// Parameter types for API calls
export interface IslandGroupParams {
  readonly islandGroupCode: IslandGroup['code'];
}

export interface RegionParams {
  readonly regionCode: string;
}

export interface ProvinceParams {
  readonly provinceCode: string;
}

export interface DistrictParams {
  readonly districtCode: string;
}

export interface CityParams {
  readonly cityCode: string;
}

export interface MunicipalityParams {
  readonly municipalityCode: string;
}

export interface SubMunicipalityParams {
  readonly subMunicipalityCode: string;
}

export interface CityMunicipalityParams {
  readonly cityOrMunicipalityCode: string;
}

export interface BarangayParams {
  readonly barangayCode: string;
}

// Search parameters
export interface SearchByNameParams {
  readonly name: string;
  readonly type?: EntityType;
  readonly limit?: number;
}

// Validation parameters
export interface ValidateCodeParams {
  readonly code: string;
  readonly type?: EntityType;
}

// Hierarchy parameters
export interface GetHierarchyParams {
  readonly code: string;
}
