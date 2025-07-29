import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PSGCClient } from '../services/psgc-client.js';
import type { Region, Province, City, Municipality, Barangay } from '../types';
import {
  GeographicCodeSchema,
  EntityTypeSchema,
  SearchNameSchema,
} from '../types/validation.schemas.js';

export function registerSearchTools(server: McpServer, psgcClient: PSGCClient): void {
  // 4.8.1 Search entities by name across all levels
  server.tool(
    'search_by_name',
    'Search for geographic entities by name across all levels (regions, provinces, cities, municipalities, barangays)',
    {
      name: SearchNameSchema,
      type: EntityTypeSchema.optional(),
      limit: z.number().int().positive().max(100).default(10).optional(),
    },
    async ({ name, type, limit }) => {
      try {
        const searchLimit = limit || 10;
        const results: Array<Record<string, unknown>> = [];

        // Search in regions
        if (!type || type === 'region') {
          const regions = await psgcClient.getRegions();
          const matching = regions
            .filter((r: Region) => r.name.toLowerCase().includes(name.toLowerCase()))
            .slice(0, searchLimit);
          results.push(...matching.map((r: Region) => ({ ...r, entityType: 'region' })));
        }

        // Search in provinces
        if (!type || type === 'province') {
          const provinces = await psgcClient.getProvinces();
          const matching = provinces
            .filter((p: Province) => p.name.toLowerCase().includes(name.toLowerCase()))
            .slice(0, searchLimit);
          results.push(...matching.map((p: Province) => ({ ...p, entityType: 'province' })));
        }

        // Search in cities
        if (!type || type === 'city') {
          const cities = await psgcClient.getCities();
          const matching = cities
            .filter((c: City) => c.name.toLowerCase().includes(name.toLowerCase()))
            .slice(0, searchLimit);
          results.push(...matching.map((c: City) => ({ ...c, entityType: 'city' })));
        }

        // Search in municipalities
        if (!type || type === 'municipality') {
          const municipalities = await psgcClient.getMunicipalities();
          const matching = municipalities
            .filter((m: Municipality) => m.name.toLowerCase().includes(name.toLowerCase()))
            .slice(0, searchLimit);
          results.push(
            ...matching.map((m: Municipality) => ({ ...m, entityType: 'municipality' }))
          );
        }

        // Search in barangays
        if (!type || type === 'barangay') {
          const barangays = await psgcClient.getBarangays();
          const matching = barangays
            .filter((b: Barangay) => b.name.toLowerCase().includes(name.toLowerCase()))
            .slice(0, searchLimit);
          results.push(...matching.map((b: Barangay) => ({ ...b, entityType: 'barangay' })));
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results.slice(0, searchLimit), null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // 4.8.2 Get complete hierarchy for a code
  server.tool(
    'get_hierarchy',
    'Get complete geographic hierarchy for a specific code (shows parent entities)',
    {
      code: GeographicCodeSchema,
    },
    async ({ code }) => {
      try {
        const hierarchy: {
          code: string;
          entityType?: string;
          levels: Array<{ type: string; data: unknown }>;
        } = {
          code,
          levels: [],
        };

        // Determine entity type based on code pattern
        let entityType: string;
        const codeStr = String(code);

        if (codeStr.length === 9) {
          if (codeStr.endsWith('000000')) {
            entityType = 'region';
          } else if (codeStr.endsWith('000')) {
            if (codeStr.substring(3, 6) === '000') {
              entityType = 'province';
            } else {
              entityType = 'city/municipality';
            }
          } else {
            entityType = 'barangay';
          }
        } else {
          throw new Error('Invalid code format - must be 9 digits');
        }

        hierarchy.entityType = entityType;

        // Build hierarchy based on entity type
        switch (entityType) {
          case 'barangay': {
            const barangay = await psgcClient.getBarangay(codeStr);
            hierarchy.levels.unshift({ type: 'barangay', data: barangay });

            // Get city/municipality
            const cityOrMunicipalityCode = codeStr.substring(0, 6) + '000';
            try {
              const cityMunicipality = await psgcClient.getCityMunicipality(cityOrMunicipalityCode);
              hierarchy.levels.unshift({ type: 'city/municipality', data: cityMunicipality });

              // Get province
              const provinceCode = codeStr.substring(0, 3) + '000000';
              const province = await psgcClient.getProvince(provinceCode);
              hierarchy.levels.unshift({ type: 'province', data: province });

              // Get region
              const regionCode = codeStr.substring(0, 2) + '0000000';
              const region = await psgcClient.getRegion(regionCode);
              hierarchy.levels.unshift({ type: 'region', data: region });

              // Get island group
              const islandGroup = await psgcClient.getIslandGroup(region.islandGroupCode);
              hierarchy.levels.unshift({ type: 'island_group', data: islandGroup });
            } catch {
              // Handle cases where parent entities might not exist
            }
            break;
          }

          case 'city':
          case 'municipality': {
            const cityMunicipality = await psgcClient.getCityMunicipality(codeStr);
            hierarchy.levels.unshift({ type: 'city/municipality', data: cityMunicipality });

            // Get province
            const provinceCode2 = codeStr.substring(0, 3) + '000000';
            const province2 = await psgcClient.getProvince(provinceCode2);
            hierarchy.levels.unshift({ type: 'province', data: province2 });

            // Get region
            const regionCode2 = codeStr.substring(0, 2) + '0000000';
            const region2 = await psgcClient.getRegion(regionCode2);
            hierarchy.levels.unshift({ type: 'region', data: region2 });

            // Get island group
            const islandGroup2 = await psgcClient.getIslandGroup(region2.islandGroupCode);
            hierarchy.levels.unshift({ type: 'island_group', data: islandGroup2 });
            break;
          }

          case 'province': {
            const province3 = await psgcClient.getProvince(codeStr);
            hierarchy.levels.unshift({ type: 'province', data: province3 });

            // Get region
            const regionCode3 = codeStr.substring(0, 2) + '0000000';
            const region3 = await psgcClient.getRegion(regionCode3);
            hierarchy.levels.unshift({ type: 'region', data: region3 });

            // Get island group
            const islandGroup3 = await psgcClient.getIslandGroup(region3.islandGroupCode);
            hierarchy.levels.unshift({ type: 'island_group', data: islandGroup3 });
            break;
          }

          case 'region': {
            const regionData = await psgcClient.getRegion(codeStr);
            hierarchy.levels.unshift({ type: 'region', data: regionData });

            // Get island group
            const islandGroupData = await psgcClient.getIslandGroup(regionData.islandGroupCode);
            hierarchy.levels.unshift({ type: 'island_group', data: islandGroupData });
            break;
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(hierarchy, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // 4.8.3 Validate if a geographic code exists
  server.tool(
    'validate_code',
    'Validate if a geographic code exists and return its type',
    {
      code: GeographicCodeSchema,
    },
    async ({ code }) => {
      try {
        const codeStr = String(code);
        let entityType: string | null = null;
        let exists = false;
        let data: unknown = null;

        // Determine entity type based on code pattern
        if (codeStr.length === 9) {
          if (codeStr.endsWith('000000')) {
            entityType = 'region';
            try {
              data = await psgcClient.getRegion(codeStr);
              exists = true;
            } catch {
              exists = false;
            }
          } else if (codeStr.endsWith('000')) {
            if (codeStr.substring(3, 6) === '000') {
              entityType = 'province';
              try {
                data = await psgcClient.getProvince(codeStr);
                exists = true;
              } catch {
                exists = false;
              }
            } else {
              entityType = 'city/municipality';
              try {
                data = await psgcClient.getCityMunicipality(codeStr);
                exists = true;
              } catch {
                exists = false;
              }
            }
          } else {
            entityType = 'barangay';
            try {
              data = await psgcClient.getBarangay(codeStr);
              exists = true;
            } catch {
              exists = false;
            }
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  code: codeStr,
                  valid: exists,
                  type: entityType,
                  data: exists ? data : null,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
