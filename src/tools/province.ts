import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PSGCClient } from '../services/psgc-client.js';
import { ProvinceCodeSchema } from '../types/validation.schemas.js';

export function registerProvinceTools(server: McpServer, psgcClient: PSGCClient): void {
  // 4.3.1 List all provinces
  server.tool('get_provinces', 'List all provinces in the Philippines', {}, async () => {
    try {
      const data = await psgcClient.getProvinces();
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

  // 4.3.2 Get specific province by code
  server.tool(
    'get_province',
    'Get specific province by code',
    {
      code: ProvinceCodeSchema,
    },
    async ({ code }) => {
      try {
        const data = await psgcClient.getProvince(code);
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

  // 4.3.3 Get cities in a province
  server.tool(
    'get_province_cities',
    'Get all cities within a specific province',
    {
      provinceCode: ProvinceCodeSchema,
    },
    async ({ provinceCode }) => {
      try {
        const data = await psgcClient.getProvinceCities(provinceCode);
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

  // 4.3.4 Get municipalities in a province
  server.tool(
    'get_province_municipalities',
    'Get all municipalities within a specific province',
    {
      provinceCode: ProvinceCodeSchema,
    },
    async ({ provinceCode }) => {
      try {
        const data = await psgcClient.getProvinceMunicipalities(provinceCode);
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

  // 4.3.5 Get cities and municipalities in a province
  server.tool(
    'get_province_cities_municipalities',
    'Get all cities and municipalities within a specific province',
    {
      provinceCode: ProvinceCodeSchema,
    },
    async ({ provinceCode }) => {
      try {
        const data = await psgcClient.getProvinceCitiesMunicipalities(provinceCode);
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

  // 4.3.6 Get sub-municipalities in a province
  server.tool(
    'get_province_sub_municipalities',
    'Get all sub-municipalities within a specific province',
    {
      provinceCode: ProvinceCodeSchema,
    },
    async ({ provinceCode }) => {
      try {
        const data = await psgcClient.getProvinceSubMunicipalities(provinceCode);
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

  // 4.3.7 Get barangays in a province
  server.tool(
    'get_province_barangays',
    'Get all barangays within a specific province',
    {
      provinceCode: ProvinceCodeSchema,
    },
    async ({ provinceCode }) => {
      try {
        const data = await psgcClient.getProvinceBarangays(provinceCode);
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
