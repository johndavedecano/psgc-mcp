import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PSGCClient } from '../services/psgc-client.js';
import { BarangayCodeSchema } from '../types/validation.schemas.js';

export function registerBarangayTools(server: McpServer, psgcClient: PSGCClient): void {
  // 4.6.1 List all barangays
  server.tool('get_barangays', 'List all barangays in the Philippines', {}, async () => {
    try {
      const data = await psgcClient.getBarangays();
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

  // 4.6.2 Get specific barangay by code
  server.tool(
    'get_barangay',
    'Get specific barangay by code',
    {
      code: BarangayCodeSchema,
    },
    async ({ code }) => {
      try {
        const data = await psgcClient.getBarangay(code);
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
