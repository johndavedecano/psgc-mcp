import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PSGCClient } from '../../../src/services/psgc-client.js';
import { registerIslandGroupTools } from '../../../src/tools/island-group.js';
import type {
  IslandGroup,
  Region,
  Province,
  City,
  Municipality,
  Barangay,
} from '../../../src/types/psgc.types.js';

// Mock data for testing
const mockIslandGroups: IslandGroup[] = [
  {
    code: 'luzon',
    name: 'Luzon',
  },
  {
    code: 'visayas',
    name: 'Visayas',
  },
  {
    code: 'mindanao',
    name: 'Mindanao',
  },
];

const mockIslandGroup: IslandGroup = {
  code: 'luzon',
  name: 'Luzon',
};

const mockRegions: Region[] = [
  {
    code: '010000000',
    name: 'Ilocos Region',
    regionName: 'Region I',
    islandGroupCode: 'luzon',
  },
  {
    code: '130000000',
    name: 'National Capital Region',
    regionName: 'NCR',
    islandGroupCode: 'luzon',
  },
];

const mockProvinces: Province[] = [
  {
    code: '012800000',
    name: 'Benguet',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
  },
  {
    code: '015500000',
    name: 'Ilocos Norte',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
  },
];

const mockCities: City[] = [
  {
    code: '012805000',
    name: 'Baguio City',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: false,
    isCapital: false,
  },
];

const mockMunicipalities: Municipality[] = [
  {
    code: '012801000',
    name: 'Atok',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
  },
];

const mockBarangays: Barangay[] = [
  {
    code: '012805001',
    name: 'Barangay 1',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
    cityCode: '012805000',
  },
];

describe('Island Group Tools', () => {
  let mockServer: McpServer;
  let mockPsgcClient: PSGCClient;
  let registeredTools: Map<string, any>;

  beforeEach(() => {
    // Create mock server
    registeredTools = new Map();
    mockServer = {
      tool: vi.fn((name, description, schema, handler) => {
        registeredTools.set(name, { name, description, schema, handler });
      }),
    } as any;

    // Create mock PSGC client
    mockPsgcClient = {
      getIslandGroups: vi.fn(),
      getIslandGroup: vi.fn(),
      getIslandGroupRegions: vi.fn(),
      getIslandGroupProvinces: vi.fn(),
      getIslandGroupCities: vi.fn(),
      getIslandGroupMunicipalities: vi.fn(),
      getIslandGroupBarangays: vi.fn(),
    } as any;

    // Register the tools
    registerIslandGroupTools(mockServer, mockPsgcClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
    registeredTools.clear();
  });

  describe('Tool Registration', () => {
    it('should register all island group tools', () => {
      expect(mockServer.tool).toHaveBeenCalledTimes(7);
      expect(registeredTools.has('get_island_groups')).toBe(true);
      expect(registeredTools.has('get_island_group')).toBe(true);
      expect(registeredTools.has('get_island_group_regions')).toBe(true);
      expect(registeredTools.has('get_island_group_provinces')).toBe(true);
      expect(registeredTools.has('get_island_group_cities')).toBe(true);
      expect(registeredTools.has('get_island_group_municipalities')).toBe(true);
      expect(registeredTools.has('get_island_group_barangays')).toBe(true);
    });

    it('should register tools with correct descriptions', () => {
      const getIslandGroupsTool = registeredTools.get('get_island_groups');
      const getIslandGroupTool = registeredTools.get('get_island_group');
      const getIslandGroupRegionsTool = registeredTools.get('get_island_group_regions');

      expect(getIslandGroupsTool.description).toBe('List all island groups in the Philippines');
      expect(getIslandGroupTool.description).toBe('Get specific island group by code');
      expect(getIslandGroupRegionsTool.description).toBe(
        'Get all regions within a specific island group'
      );
    });
  });

  describe('get_island_groups', () => {
    it('should_return_all_island_groups_when_api_call_succeeds', async () => {
      // Arrange
      mockPsgcClient.getIslandGroups = vi.fn().mockResolvedValue(mockIslandGroups);
      const tool = registeredTools.get('get_island_groups');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getIslandGroups).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockIslandGroups, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const errorMessage = 'Network error';
      mockPsgcClient.getIslandGroups = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_island_groups');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getIslandGroups).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      });
    });

    it('should_handle_unknown_error_types', async () => {
      // Arrange
      mockPsgcClient.getIslandGroups = vi.fn().mockRejectedValue('String error');
      const tool = registeredTools.get('get_island_groups');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'Error: Unknown error',
          },
        ],
        isError: true,
      });
    });
  });

  describe('get_island_group', () => {
    it('should_return_specific_island_group_when_valid_code_provided', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      mockPsgcClient.getIslandGroup = vi.fn().mockResolvedValue(mockIslandGroup);
      const tool = registeredTools.get('get_island_group');

      // Act
      const result = await tool.handler({ code: islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroup).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockIslandGroup, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      const errorMessage = 'Island group not found';
      mockPsgcClient.getIslandGroup = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_island_group');

      // Act
      const result = await tool.handler({ code: islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroup).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      });
    });
  });

  describe('get_island_group_regions', () => {
    it('should_return_regions_in_island_group_when_valid_code_provided', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      mockPsgcClient.getIslandGroupRegions = vi.fn().mockResolvedValue(mockRegions);
      const tool = registeredTools.get('get_island_group_regions');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroupRegions).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockRegions, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      const errorMessage = 'Failed to fetch regions';
      mockPsgcClient.getIslandGroupRegions = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_island_group_regions');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroupRegions).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      });
    });
  });

  describe('get_island_group_provinces', () => {
    it('should_return_provinces_in_island_group_when_valid_code_provided', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      mockPsgcClient.getIslandGroupProvinces = vi.fn().mockResolvedValue(mockProvinces);
      const tool = registeredTools.get('get_island_group_provinces');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroupProvinces).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockProvinces, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      const errorMessage = 'Failed to fetch provinces';
      mockPsgcClient.getIslandGroupProvinces = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_island_group_provinces');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroupProvinces).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      });
    });
  });

  describe('get_island_group_cities', () => {
    it('should_return_cities_in_island_group_when_valid_code_provided', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      mockPsgcClient.getIslandGroupCities = vi.fn().mockResolvedValue(mockCities);
      const tool = registeredTools.get('get_island_group_cities');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroupCities).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockCities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      const errorMessage = 'Failed to fetch cities';
      mockPsgcClient.getIslandGroupCities = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_island_group_cities');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroupCities).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      });
    });
  });

  describe('get_island_group_municipalities', () => {
    it('should_return_municipalities_in_island_group_when_valid_code_provided', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      mockPsgcClient.getIslandGroupMunicipalities = vi.fn().mockResolvedValue(mockMunicipalities);
      const tool = registeredTools.get('get_island_group_municipalities');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroupMunicipalities).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockMunicipalities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      const errorMessage = 'Failed to fetch municipalities';
      mockPsgcClient.getIslandGroupMunicipalities = vi
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_island_group_municipalities');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroupMunicipalities).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      });
    });
  });

  describe('get_island_group_barangays', () => {
    it('should_return_barangays_in_island_group_when_valid_code_provided', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      mockPsgcClient.getIslandGroupBarangays = vi.fn().mockResolvedValue(mockBarangays);
      const tool = registeredTools.get('get_island_group_barangays');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroupBarangays).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockBarangays, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      const errorMessage = 'Failed to fetch barangays';
      mockPsgcClient.getIslandGroupBarangays = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_island_group_barangays');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(mockPsgcClient.getIslandGroupBarangays).toHaveBeenCalledWith(islandGroupCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should_handle_empty_results_gracefully', async () => {
      // Arrange
      mockPsgcClient.getIslandGroups = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_island_groups');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify([], null, 2),
          },
        ],
      });
    });

    it('should_handle_null_results_gracefully', async () => {
      // Arrange
      mockPsgcClient.getIslandGroup = vi.fn().mockResolvedValue(null);
      const tool = registeredTools.get('get_island_group');

      // Act
      const result = await tool.handler({ code: 'invalid' });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(null, null, 2),
          },
        ],
      });
    });

    it('should_handle_empty_regions_list_gracefully', async () => {
      // Arrange
      const islandGroupCode = 'luzon';
      mockPsgcClient.getIslandGroupRegions = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_island_group_regions');

      // Act
      const result = await tool.handler({ islandGroupCode });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify([], null, 2),
          },
        ],
      });
    });
  });
});
