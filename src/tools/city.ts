import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PSGCClient } from '../services/psgc-client.js';
import { CityCodeSchema } from '../types/validation.schemas.js';

export function registerCityTools(server: McpServer, psgcClient: PSGCClient): void {
  // 4.4.1 List all cities
  server.tool('get_cities', 'List all cities in the Philippines', {}, async () => {
    try {
      const data = await psgcClient.getCities();
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

  // 4.4.2 Get specific city by code
  server.tool(
    'get_city',
    'Get specific city by code',
    {
      code: CityCodeSchema,
    },
    async ({ code }) => {
      try {
        const data = await psgcClient.getCity(code);
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

  // 4.4.3 Get barangays in a city
  server.tool(
    'get_city_barangays',
    'Get all barangays within a specific city',
    {
      cityCode: CityCodeSchema,
    },
    async ({ cityCode }) => {
      try {
        const data = await psgcClient.getCityBarangays(cityCode);
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
