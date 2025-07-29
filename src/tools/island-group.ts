import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PSGCClient } from '../services/psgc-client.js';
import { IslandGroupCodeSchema } from '../types/validation.schemas.js';

export function registerIslandGroupTools(server: McpServer, psgcClient: PSGCClient): void {
  // 4.1.1 List all island groups
  server.tool('get_island_groups', 'List all island groups in the Philippines', {}, async () => {
    try {
      const data = await psgcClient.getIslandGroups();
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

  // 4.1.2 Get specific island group by code
  server.tool(
    'get_island_group',
    'Get specific island group by code',
    {
      code: IslandGroupCodeSchema,
    },
    async ({ code }) => {
      try {
        const data = await psgcClient.getIslandGroup(code);
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

  // 4.1.3 Get regions in an island group
  server.tool(
    'get_island_group_regions',
    'Get all regions within a specific island group',
    {
      islandGroupCode: IslandGroupCodeSchema,
    },
    async ({ islandGroupCode }) => {
      try {
        const data = await psgcClient.getIslandGroupRegions(islandGroupCode);
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

  // 4.1.4 Get provinces in an island group
  server.tool(
    'get_island_group_provinces',
    'Get all provinces within a specific island group',
    {
      islandGroupCode: IslandGroupCodeSchema,
    },
    async ({ islandGroupCode }) => {
      try {
        const data = await psgcClient.getIslandGroupProvinces(islandGroupCode);
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

  // 4.1.5 Get cities in an island group
  server.tool(
    'get_island_group_cities',
    'Get all cities within a specific island group',
    {
      islandGroupCode: IslandGroupCodeSchema,
    },
    async ({ islandGroupCode }) => {
      try {
        const data = await psgcClient.getIslandGroupCities(islandGroupCode);
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

  // 4.1.6 Get municipalities in an island group
  server.tool(
    'get_island_group_municipalities',
    'Get all municipalities within a specific island group',
    {
      islandGroupCode: IslandGroupCodeSchema,
    },
    async ({ islandGroupCode }) => {
      try {
        const data = await psgcClient.getIslandGroupMunicipalities(islandGroupCode);
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

  // 4.1.7 Get barangays in an island group
  server.tool(
    'get_island_group_barangays',
    'Get all barangays within a specific island group',
    {
      islandGroupCode: IslandGroupCodeSchema,
    },
    async ({ islandGroupCode }) => {
      try {
        const data = await psgcClient.getIslandGroupBarangays(islandGroupCode);
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
