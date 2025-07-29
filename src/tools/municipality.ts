import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PSGCClient } from '../services/psgc-client.js';
import { MunicipalityCodeSchema } from '../types/validation.schemas.js';

export function registerMunicipalityTools(server: McpServer, psgcClient: PSGCClient) {
  // 4.5.1 List all municipalities
  server.tool('get_municipalities', 'List all municipalities in the Philippines', {}, async () => {
    try {
      const data = await psgcClient.getMunicipalities();
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

  // 4.5.2 Get specific municipality by code
  server.tool(
    'get_municipality',
    'Get specific municipality by code',
    {
      code: MunicipalityCodeSchema,
    },
    async ({ code }) => {
      try {
        const data = await psgcClient.getMunicipality(code);
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

  // 4.5.3 Get barangays in a municipality
  server.tool(
    'get_municipality_barangays',
    'Get all barangays within a specific municipality',
    {
      municipalityCode: MunicipalityCodeSchema,
    },
    async ({ municipalityCode }) => {
      try {
        const data = await psgcClient.getMunicipalityBarangays(municipalityCode);
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
