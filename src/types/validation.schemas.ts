/**
 * Zod validation schemas for PSGC API parameters
 * Based on the official PSGC API OpenAPI specification
 */

import { z } from 'zod';
import { GEOGRAPHIC_CODES } from './constants';

// Use constants from constants.ts for consistency
const { PATTERNS: CODE_PATTERNS, ISLAND_GROUPS: ISLAND_GROUP_CODES } = GEOGRAPHIC_CODES;

// Entity type enum
export const EntityTypeSchema = z.enum([
  'island-group',
  'region',
  'province',
  'district',
  'city',
  'municipality',
  'city-municipality',
  'sub-municipality',
  'barangay',
]);

// Island Group schemas
export const IslandGroupCodeSchema = z.enum(ISLAND_GROUP_CODES);

// Geographic code schemas
export const RegionCodeSchema = z
  .string()
  .regex(
    CODE_PATTERNS.SIX_ZEROS,
    'Region code must be 9 digits ending with 6 zeros (e.g., 130000000)'
  );

export const ProvinceCodeSchema = z
  .string()
  .regex(
    CODE_PATTERNS.SIX_ZEROS,
    'Province code must be 9 digits ending with 6 zeros (e.g., 012800000)'
  );

export const DistrictCodeSchema = z
  .string()
  .regex(
    CODE_PATTERNS.SIX_ZEROS,
    'District code must be 9 digits ending with 6 zeros (e.g., 133900000)'
  );

export const CityCodeSchema = z
  .string()
  .regex(
    CODE_PATTERNS.THREE_ZEROS,
    'City code must be 9 digits ending with 3 zeros (e.g., 012805000)'
  );

export const MunicipalityCodeSchema = z
  .string()
  .regex(
    CODE_PATTERNS.THREE_ZEROS,
    'Municipality code must be 9 digits ending with 3 zeros (e.g., 012801000)'
  );

export const SubMunicipalityCodeSchema = z
  .string()
  .regex(
    CODE_PATTERNS.THREE_ZEROS,
    'Sub-municipality code must be 9 digits ending with 3 zeros (e.g., 133901000)'
  );

export const CityMunicipalityCodeSchema = z
  .string()
  .regex(
    CODE_PATTERNS.THREE_ZEROS,
    'City/municipality code must be 9 digits ending with 3 zeros (e.g., 012805000)'
  );

export const BarangayCodeSchema = z
  .string()
  .regex(CODE_PATTERNS.BARANGAY, 'Barangay code must be exactly 9 digits (e.g., 012805001)');

// Parameter schemas for API calls
export const IslandGroupParamsSchema = z.object({
  islandGroupCode: IslandGroupCodeSchema,
});

export const RegionParamsSchema = z.object({
  regionCode: RegionCodeSchema,
});

export const ProvinceParamsSchema = z.object({
  provinceCode: ProvinceCodeSchema,
});

export const DistrictParamsSchema = z.object({
  districtCode: DistrictCodeSchema,
});

export const CityParamsSchema = z.object({
  cityCode: CityCodeSchema,
});

export const MunicipalityParamsSchema = z.object({
  municipalityCode: MunicipalityCodeSchema,
});

export const SubMunicipalityParamsSchema = z.object({
  subMunicipalityCode: SubMunicipalityCodeSchema,
});

export const CityMunicipalityParamsSchema = z.object({
  cityOrMunicipalityCode: CityMunicipalityCodeSchema,
});

export const BarangayParamsSchema = z.object({
  barangayCode: BarangayCodeSchema,
});

// Search parameters
export const SearchByNameParamsSchema = z.object({
  name: z.string().min(1, 'Search name cannot be empty'),
  type: EntityTypeSchema.optional(),
  limit: z.number().int().positive().max(100).optional().default(10),
});

// Validation parameters
export const ValidateCodeParamsSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty'),
  type: EntityTypeSchema.optional(),
});

// Hierarchy parameters
export const GetHierarchyParamsSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty'),
});

// Additional schemas for search tools
export const GeographicCodeSchema = z.string().min(1, 'Code cannot be empty');
export const SearchNameSchema = z.string().min(1, 'Search name cannot be empty');

// Response validation schemas
export const IslandGroupSchema = z.object({
  code: IslandGroupCodeSchema,
  name: z.string(),
});

export const RegionSchema = z.object({
  code: RegionCodeSchema,
  name: z.string(),
  regionName: z.string().optional(),
  islandGroupCode: IslandGroupCodeSchema,
});

export const ProvinceSchema = z.object({
  code: ProvinceCodeSchema,
  name: z.string(),
  regionCode: RegionCodeSchema,
  islandGroupCode: IslandGroupCodeSchema,
});

export const DistrictSchema = z.object({
  code: DistrictCodeSchema,
  name: z.string(),
  regionCode: RegionCodeSchema,
  islandGroupCode: IslandGroupCodeSchema,
});

export const MunicipalitySchema = z.object({
  code: MunicipalityCodeSchema,
  name: z.string(),
  oldName: z.string().optional(),
  isCapital: z.boolean().optional(),
  districtCode: z.union([DistrictCodeSchema, z.boolean()]).optional(),
  provinceCode: z.union([ProvinceCodeSchema, z.boolean()]),
  regionCode: RegionCodeSchema,
  islandGroupCode: IslandGroupCodeSchema,
});

export const CitySchema = z.object({
  code: CityCodeSchema,
  name: z.string(),
  oldName: z.string().optional(),
  isCapital: z.boolean().optional(),
  districtCode: z.union([DistrictCodeSchema, z.boolean()]).optional(),
  provinceCode: z.union([ProvinceCodeSchema, z.boolean()]),
  regionCode: RegionCodeSchema,
  islandGroupCode: IslandGroupCodeSchema,
});

export const SubMunicipalitySchema = z.object({
  code: SubMunicipalityCodeSchema,
  name: z.string(),
  oldName: z.string().optional(),
  districtCode: z.union([DistrictCodeSchema, z.boolean()]).optional(),
  provinceCode: z.union([ProvinceCodeSchema, z.boolean()]),
  regionCode: RegionCodeSchema,
  islandGroupCode: IslandGroupCodeSchema,
});

export const CityMunicipalitySchema = z.object({
  code: CityMunicipalityCodeSchema,
  name: z.string(),
  oldName: z.string().optional(),
  isCapital: z.boolean().optional(),
  isCity: z.boolean().optional(),
  isMunicipality: z.boolean().optional(),
  districtCode: z.union([DistrictCodeSchema, z.boolean()]).optional(),
  provinceCode: z.union([ProvinceCodeSchema, z.boolean()]),
  regionCode: RegionCodeSchema,
  islandGroupCode: IslandGroupCodeSchema,
});

export const BarangaySchema = z.object({
  code: BarangayCodeSchema,
  name: z.string(),
  oldName: z.string().optional(),
  subMunicipalityCode: z.union([SubMunicipalityCodeSchema, z.boolean()]).optional(),
  cityCode: z.union([CityCodeSchema, z.boolean()]).optional(),
  municipalityCode: z.union([MunicipalityCodeSchema, z.boolean()]).optional(),
  districtCode: z.union([DistrictCodeSchema, z.boolean()]).optional(),
  provinceCode: ProvinceCodeSchema,
  regionCode: RegionCodeSchema,
  islandGroupCode: IslandGroupCodeSchema,
});

// Array schemas for API responses
export const IslandGroupsResponseSchema = z.array(IslandGroupSchema);
export const RegionsResponseSchema = z.array(RegionSchema);
export const ProvincesResponseSchema = z.array(ProvinceSchema);
export const DistrictsResponseSchema = z.array(DistrictSchema);
export const CitiesResponseSchema = z.array(CitySchema);
export const MunicipalitiesResponseSchema = z.array(MunicipalitySchema);
export const SubMunicipalitiesResponseSchema = z.array(SubMunicipalitySchema);
export const CityMunicipalitiesResponseSchema = z.array(CityMunicipalitySchema);
export const BarangaysResponseSchema = z.array(BarangaySchema);

// Type exports
export type IslandGroupCode = z.infer<typeof IslandGroupCodeSchema>;
export type EntityType = z.infer<typeof EntityTypeSchema>;
export type IslandGroupParams = z.infer<typeof IslandGroupParamsSchema>;
export type RegionParams = z.infer<typeof RegionParamsSchema>;
export type ProvinceParams = z.infer<typeof ProvinceParamsSchema>;
export type DistrictParams = z.infer<typeof DistrictParamsSchema>;
export type CityParams = z.infer<typeof CityParamsSchema>;
export type MunicipalityParams = z.infer<typeof MunicipalityParamsSchema>;
export type SubMunicipalityParams = z.infer<typeof SubMunicipalityParamsSchema>;
export type CityMunicipalityParams = z.infer<typeof CityMunicipalityParamsSchema>;
export type BarangayParams = z.infer<typeof BarangayParamsSchema>;
export type SearchByNameParams = z.infer<typeof SearchByNameParamsSchema>;
export type ValidateCodeParams = z.infer<typeof ValidateCodeParamsSchema>;
export type GetHierarchyParams = z.infer<typeof GetHierarchyParamsSchema>;
