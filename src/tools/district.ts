import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PSGCClient } from '../services/psgc-client.js';
import { DistrictCodeSchema } from '../types/validation.schemas.js';

export function registerDistrictTools(server: McpServer, psgcClient: PSGCClient): void {
  // 4.7.1 List all districts
  server.tool('get_districts', 'List all districts in the Philippines', {}, async () => {
    try {
      const data = await psgcClient.getDistricts();
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

  // 4.7.2 Get specific district by code
  server.tool(
    'get_district',
    'Get specific district by code',
    {
      code: DistrictCodeSchema,
    },
    async ({ code }) => {
      try {
        const data = await psgcClient.getDistrict(code);
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

  // 4.7.3 Get cities in a district
  server.tool(
    'get_district_cities',
    'Get all cities within a specific district',
    {
      districtCode: DistrictCodeSchema,
    },
    async ({ districtCode }) => {
      try {
        const data = await psgcClient.getDistrictCities(districtCode);
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

  // 4.7.4 Get municipalities in a district
  server.tool(
    'get_district_municipalities',
    'Get all municipalities within a specific district',
    {
      districtCode: DistrictCodeSchema,
    },
    async ({ districtCode }) => {
      try {
        const data = await psgcClient.getDistrictMunicipalities(districtCode);
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

  // 4.7.5 Get cities and municipalities in a district
  server.tool(
    'get_district_cities_municipalities',
    'Get all cities and municipalities within a specific district',
    {
      districtCode: DistrictCodeSchema,
    },
    async ({ districtCode }) => {
      try {
        const data = await psgcClient.getDistrictCitiesMunicipalities(districtCode);
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

  // 4.7.6 Get sub-municipalities in a district
  server.tool(
    'get_district_sub_municipalities',
    'Get all sub-municipalities within a specific district',
    {
      districtCode: DistrictCodeSchema,
    },
    async ({ districtCode }) => {
      try {
        const data = await psgcClient.getDistrictSubMunicipalities(districtCode);
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

  // 4.7.7 Get barangays in a district
  server.tool(
    'get_district_barangays',
    'Get all barangays within a specific district',
    {
      districtCode: DistrictCodeSchema,
    },
    async ({ districtCode }) => {
      try {
        const data = await psgcClient.getDistrictBarangays(districtCode);
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
