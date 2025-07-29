import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PSGCClient } from '../../../src/services/psgc-client.js';
import { registerRegionTools } from '../../../src/tools/region.js';
import type {
  Region,
  Province,
  District,
  City,
  Municipality,
  CityMunicipality,
  SubMunicipality,
  Barangay,
} from '../../../src/types/psgc.types.js';

// Mock data for testing
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

const mockRegion: Region = {
  code: '010000000',
  name: 'Ilocos Region',
  regionName: 'Region I',
  islandGroupCode: 'luzon',
};

const mockRegionProvinces: Province[] = [
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

const mockRegionDistricts: District[] = [
  {
    code: '133900000',
    name: 'First District of Metro Manila',
    regionCode: '130000000',
    islandGroupCode: 'luzon',
  },
];

const mockRegionCities: City[] = [
  {
    code: '012805000',
    name: 'Baguio City',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: false,
    isCapital: false,
  },
];

const mockRegionMunicipalities: Municipality[] = [
  {
    code: '012801000',
    name: 'Atok',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
  },
];

const mockRegionCitiesMunicipalities: CityMunicipality[] = [
  {
    code: '012805000',
    name: 'Baguio City',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: false,
    isCapital: false,
    isCity: true,
  },
  {
    code: '012801000',
    name: 'Atok',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
    isMunicipality: true,
  },
];

const mockRegionSubMunicipalities: SubMunicipality[] = [
  {
    code: '012801000',
    name: 'Sample Sub-Municipality',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
  },
];

const mockRegionBarangays: Barangay[] = [
  {
    code: '012801001',
    name: 'Barangay 1',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
    municipalityCode: '012801000',
  },
];

describe('Region Tools', () => {
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
      getRegions: vi.fn(),
      getRegion: vi.fn(),
      getRegionProvinces: vi.fn(),
      getRegionDistricts: vi.fn(),
      getRegionCities: vi.fn(),
      getRegionMunicipalities: vi.fn(),
      getRegionCitiesMunicipalities: vi.fn(),
      getRegionSubMunicipalities: vi.fn(),
      getRegionBarangays: vi.fn(),
    } as any;

    // Register the tools
    registerRegionTools(mockServer, mockPsgcClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
    registeredTools.clear();
  });

  describe('Tool Registration', () => {
    it('should register all region tools', () => {
      expect(mockServer.tool).toHaveBeenCalledTimes(9);
      expect(registeredTools.has('get_regions')).toBe(true);
      expect(registeredTools.has('get_region')).toBe(true);
      expect(registeredTools.has('get_region_provinces')).toBe(true);
      expect(registeredTools.has('get_region_districts')).toBe(true);
      expect(registeredTools.has('get_region_cities')).toBe(true);
      expect(registeredTools.has('get_region_municipalities')).toBe(true);
      expect(registeredTools.has('get_region_cities_municipalities')).toBe(true);
      expect(registeredTools.has('get_region_sub_municipalities')).toBe(true);
      expect(registeredTools.has('get_region_barangays')).toBe(true);
    });

    it('should register tools with correct descriptions', () => {
      const getRegionsTool = registeredTools.get('get_regions');
      const getRegionTool = registeredTools.get('get_region');
      const getRegionProvincesTool = registeredTools.get('get_region_provinces');

      expect(getRegionsTool.description).toBe('List all regions in the Philippines');
      expect(getRegionTool.description).toBe('Get specific region by code');
      expect(getRegionProvincesTool.description).toBe('Get all provinces within a specific region');
    });
  });

  describe('get_regions', () => {
    it('should_return_all_regions_when_api_call_succeeds', async () => {
      // Arrange
      mockPsgcClient.getRegions = vi.fn().mockResolvedValue(mockRegions);
      const tool = registeredTools.get('get_regions');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getRegions).toHaveBeenCalledTimes(1);
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
      const errorMessage = 'Network error';
      mockPsgcClient.getRegions = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_regions');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getRegions).toHaveBeenCalledTimes(1);
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
      mockPsgcClient.getRegions = vi.fn().mockRejectedValue('String error');
      const tool = registeredTools.get('get_regions');

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

  describe('get_region', () => {
    it('should_return_specific_region_when_valid_code_provided', async () => {
      // Arrange
      const regionCode = '010000000';
      mockPsgcClient.getRegion = vi.fn().mockResolvedValue(mockRegion);
      const tool = registeredTools.get('get_region');

      // Act
      const result = await tool.handler({ code: regionCode });

      // Assert
      expect(mockPsgcClient.getRegion).toHaveBeenCalledWith(regionCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockRegion, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const regionCode = '010000000';
      const errorMessage = 'Region not found';
      mockPsgcClient.getRegion = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_region');

      // Act
      const result = await tool.handler({ code: regionCode });

      // Assert
      expect(mockPsgcClient.getRegion).toHaveBeenCalledWith(regionCode);
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

  describe('get_region_provinces', () => {
    it('should_return_provinces_in_region_when_valid_code_provided', async () => {
      // Arrange
      const regionCode = '010000000';
      mockPsgcClient.getRegionProvinces = vi.fn().mockResolvedValue(mockRegionProvinces);
      const tool = registeredTools.get('get_region_provinces');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionProvinces).toHaveBeenCalledWith(regionCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockRegionProvinces, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const regionCode = '010000000';
      const errorMessage = 'Failed to fetch provinces';
      mockPsgcClient.getRegionProvinces = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_region_provinces');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionProvinces).toHaveBeenCalledWith(regionCode);
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

  describe('get_region_districts', () => {
    it('should_return_districts_in_region_when_valid_code_provided', async () => {
      // Arrange
      const regionCode = '130000000';
      mockPsgcClient.getRegionDistricts = vi.fn().mockResolvedValue(mockRegionDistricts);
      const tool = registeredTools.get('get_region_districts');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionDistricts).toHaveBeenCalledWith(regionCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockRegionDistricts, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const regionCode = '130000000';
      const errorMessage = 'Failed to fetch districts';
      mockPsgcClient.getRegionDistricts = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_region_districts');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionDistricts).toHaveBeenCalledWith(regionCode);
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

  describe('get_region_cities', () => {
    it('should_return_cities_in_region_when_valid_code_provided', async () => {
      // Arrange
      const regionCode = '010000000';
      mockPsgcClient.getRegionCities = vi.fn().mockResolvedValue(mockRegionCities);
      const tool = registeredTools.get('get_region_cities');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionCities).toHaveBeenCalledWith(regionCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockRegionCities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const regionCode = '010000000';
      const errorMessage = 'Failed to fetch cities';
      mockPsgcClient.getRegionCities = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_region_cities');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionCities).toHaveBeenCalledWith(regionCode);
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

  describe('get_region_municipalities', () => {
    it('should_return_municipalities_in_region_when_valid_code_provided', async () => {
      // Arrange
      const regionCode = '010000000';
      mockPsgcClient.getRegionMunicipalities = vi.fn().mockResolvedValue(mockRegionMunicipalities);
      const tool = registeredTools.get('get_region_municipalities');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionMunicipalities).toHaveBeenCalledWith(regionCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockRegionMunicipalities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const regionCode = '010000000';
      const errorMessage = 'Failed to fetch municipalities';
      mockPsgcClient.getRegionMunicipalities = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_region_municipalities');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionMunicipalities).toHaveBeenCalledWith(regionCode);
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

  describe('get_region_cities_municipalities', () => {
    it('should_return_cities_and_municipalities_in_region_when_valid_code_provided', async () => {
      // Arrange
      const regionCode = '010000000';
      mockPsgcClient.getRegionCitiesMunicipalities = vi
        .fn()
        .mockResolvedValue(mockRegionCitiesMunicipalities);
      const tool = registeredTools.get('get_region_cities_municipalities');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionCitiesMunicipalities).toHaveBeenCalledWith(regionCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockRegionCitiesMunicipalities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const regionCode = '010000000';
      const errorMessage = 'Failed to fetch cities and municipalities';
      mockPsgcClient.getRegionCitiesMunicipalities = vi
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_region_cities_municipalities');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionCitiesMunicipalities).toHaveBeenCalledWith(regionCode);
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

  describe('get_region_sub_municipalities', () => {
    it('should_return_sub_municipalities_in_region_when_valid_code_provided', async () => {
      // Arrange
      const regionCode = '010000000';
      mockPsgcClient.getRegionSubMunicipalities = vi
        .fn()
        .mockResolvedValue(mockRegionSubMunicipalities);
      const tool = registeredTools.get('get_region_sub_municipalities');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionSubMunicipalities).toHaveBeenCalledWith(regionCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockRegionSubMunicipalities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const regionCode = '010000000';
      const errorMessage = 'Failed to fetch sub-municipalities';
      mockPsgcClient.getRegionSubMunicipalities = vi
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_region_sub_municipalities');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionSubMunicipalities).toHaveBeenCalledWith(regionCode);
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

  describe('get_region_barangays', () => {
    it('should_return_barangays_in_region_when_valid_code_provided', async () => {
      // Arrange
      const regionCode = '010000000';
      mockPsgcClient.getRegionBarangays = vi.fn().mockResolvedValue(mockRegionBarangays);
      const tool = registeredTools.get('get_region_barangays');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionBarangays).toHaveBeenCalledWith(regionCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockRegionBarangays, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const regionCode = '010000000';
      const errorMessage = 'Failed to fetch barangays';
      mockPsgcClient.getRegionBarangays = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_region_barangays');

      // Act
      const result = await tool.handler({ regionCode });

      // Assert
      expect(mockPsgcClient.getRegionBarangays).toHaveBeenCalledWith(regionCode);
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
      mockPsgcClient.getRegions = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_regions');

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
      mockPsgcClient.getRegion = vi.fn().mockResolvedValue(null);
      const tool = registeredTools.get('get_region');

      // Act
      const result = await tool.handler({ code: '999999999' });

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

    it('should_handle_empty_provinces_list_gracefully', async () => {
      // Arrange
      const regionCode = '010000000';
      mockPsgcClient.getRegionProvinces = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_region_provinces');

      // Act
      const result = await tool.handler({ regionCode });

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
