import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PSGCClient } from '../services/psgc-client.js';
import { RegionCodeSchema } from '../types/validation.schemas.js';

export function registerRegionTools(server: McpServer, psgcClient: PSGCClient) {
  // 4.2.1 List all regions
  server.tool('get_regions', 'List all regions in the Philippines', {}, async () => {
    try {
      const data = await psgcClient.getRegions();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
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
  });

  // 4.2.2 Get specific region by code
  server.tool(
    'get_region',
    'Get specific region by code',
    {
      code: RegionCodeSchema,
    },
    async ({ code }) => {
      try {
        const data = await psgcClient.getRegion(code);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
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

  // 4.2.3 Get provinces in a region
  server.tool(
    'get_region_provinces',
    'Get all provinces within a specific region',
    {
      regionCode: RegionCodeSchema,
    },
    async ({ regionCode }) => {
      try {
        const data = await psgcClient.getRegionProvinces(regionCode);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
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

  // 4.2.4 Get districts in a region
  server.tool(
    'get_region_districts',
    'Get all districts within a specific region',
    {
      regionCode: RegionCodeSchema,
    },
    async ({ regionCode }) => {
      try {
        const data = await psgcClient.getRegionDistricts(regionCode);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
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

  // 4.2.5 Get cities in a region
  server.tool(
    'get_region_cities',
    'Get all cities within a specific region',
    {
      regionCode: RegionCodeSchema,
    },
    async ({ regionCode }) => {
      try {
        const data = await psgcClient.getRegionCities(regionCode);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
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

  // 4.2.6 Get municipalities in a region
  server.tool(
    'get_region_municipalities',
    'Get all municipalities within a specific region',
    {
      regionCode: RegionCodeSchema,
    },
    async ({ regionCode }) => {
      try {
        const data = await psgcClient.getRegionMunicipalities(regionCode);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
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

  // 4.2.7 Get cities and municipalities in a region
  server.tool(
    'get_region_cities_municipalities',
    'Get all cities and municipalities within a specific region',
    {
      regionCode: RegionCodeSchema,
    },
    async ({ regionCode }) => {
      try {
        const data = await psgcClient.getRegionCitiesMunicipalities(regionCode);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
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

  // 4.2.8 Get sub-municipalities in a region
  server.tool(
    'get_region_sub_municipalities',
    'Get all sub-municipalities within a specific region',
    {
      regionCode: RegionCodeSchema,
    },
    async ({ regionCode }) => {
      try {
        const data = await psgcClient.getRegionSubMunicipalities(regionCode);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
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

  // 4.2.9 Get barangays in a region
  server.tool(
    'get_region_barangays',
    'Get all barangays within a specific region',
    {
      regionCode: RegionCodeSchema,
    },
    async ({ regionCode }) => {
      try {
        const data = await psgcClient.getRegionBarangays(regionCode);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
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
