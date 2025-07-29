import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PSGCClient } from '../../../src/services/psgc-client.js';
import { registerSearchTools } from '../../../src/tools/search.js';
import type {
  Region,
  Province,
  City,
  Municipality,
  Barangay,
  IslandGroup,
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

const mockProvinces: Province[] = [
  {
    code: '012800000',
    name: 'Benguet',
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
    code: '012801001',
    name: 'Barangay 1',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
    municipalityCode: '012801000',
  },
];

const mockIslandGroup: IslandGroup = {
  code: 'luzon',
  name: 'Luzon',
};

const mockRegion: Region = {
  code: '010000000',
  name: 'Ilocos Region',
  regionName: 'Region I',
  islandGroupCode: 'luzon',
};

const mockProvince: Province = {
  code: '012800000',
  name: 'Benguet',
  regionCode: '010000000',
  islandGroupCode: 'luzon',
};

const mockBarangay: Barangay = {
  code: '012801001',
  name: 'Barangay 1',
  regionCode: '010000000',
  islandGroupCode: 'luzon',
  provinceCode: '012800000',
  municipalityCode: '012801000',
};

describe('Search Tools', () => {
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
      getProvinces: vi.fn(),
      getCities: vi.fn(),
      getMunicipalities: vi.fn(),
      getBarangays: vi.fn(),
      getBarangay: vi.fn(),
      getCityMunicipality: vi.fn(),
      getProvince: vi.fn(),
      getRegion: vi.fn(),
      getIslandGroup: vi.fn(),
    } as any;

    // Register the tools
    registerSearchTools(mockServer, mockPsgcClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
    registeredTools.clear();
  });

  describe('Tool Registration', () => {
    it('should register all search tools', () => {
      expect(mockServer.tool).toHaveBeenCalledTimes(3);
      expect(registeredTools.has('search_by_name')).toBe(true);
      expect(registeredTools.has('get_hierarchy')).toBe(true);
      expect(registeredTools.has('validate_code')).toBe(true);
    });

    it('should register tools with correct descriptions', () => {
      const searchByNameTool = registeredTools.get('search_by_name');
      const getHierarchyTool = registeredTools.get('get_hierarchy');
      const validateCodeTool = registeredTools.get('validate_code');

      expect(searchByNameTool.description).toBe(
        'Search for geographic entities by name across all levels (regions, provinces, cities, municipalities, barangays)'
      );
      expect(getHierarchyTool.description).toBe(
        'Get complete geographic hierarchy for a specific code (shows parent entities)'
      );
      expect(validateCodeTool.description).toBe(
        'Validate if a geographic code exists and return its type'
      );
    });
  });

  describe('search_by_name', () => {
    beforeEach(() => {
      mockPsgcClient.getRegions = vi.fn().mockResolvedValue(mockRegions);
      mockPsgcClient.getProvinces = vi.fn().mockResolvedValue(mockProvinces);
      mockPsgcClient.getCities = vi.fn().mockResolvedValue(mockCities);
      mockPsgcClient.getMunicipalities = vi.fn().mockResolvedValue(mockMunicipalities);
      mockPsgcClient.getBarangays = vi.fn().mockResolvedValue(mockBarangays);
    });

    it('should_search_across_all_entity_types_when_no_type_specified', async () => {
      // Arrange
      const tool = registeredTools.get('search_by_name');

      // Act
      const result = await tool.handler({ name: 'Region', limit: 10 });

      // Assert
      expect(mockPsgcClient.getRegions).toHaveBeenCalledTimes(1);
      expect(mockPsgcClient.getProvinces).toHaveBeenCalledTimes(1);
      expect(mockPsgcClient.getCities).toHaveBeenCalledTimes(1);
      expect(mockPsgcClient.getMunicipalities).toHaveBeenCalledTimes(1);
      expect(mockPsgcClient.getBarangays).toHaveBeenCalledTimes(1);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult).toHaveLength(2); // Should find 2 regions with "Region" in name
      expect(parsedResult[0]).toHaveProperty('entityType', 'region');
    });

    it('should_search_only_specified_entity_type_when_type_provided', async () => {
      // Arrange
      const tool = registeredTools.get('search_by_name');

      // Act
      const result = await tool.handler({ name: 'Region', type: 'region', limit: 10 });

      // Assert
      expect(mockPsgcClient.getRegions).toHaveBeenCalledTimes(1);
      expect(mockPsgcClient.getProvinces).not.toHaveBeenCalled();
      expect(mockPsgcClient.getCities).not.toHaveBeenCalled();
      expect(mockPsgcClient.getMunicipalities).not.toHaveBeenCalled();
      expect(mockPsgcClient.getBarangays).not.toHaveBeenCalled();

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult).toHaveLength(2);
      expect(parsedResult[0]).toHaveProperty('entityType', 'region');
    });

    it('should_respect_limit_parameter', async () => {
      // Arrange
      const tool = registeredTools.get('search_by_name');

      // Act
      const result = await tool.handler({ name: 'Region', limit: 1 });

      // Assert
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult).toHaveLength(1);
    });

    it('should_use_default_limit_when_not_specified', async () => {
      // Arrange
      const tool = registeredTools.get('search_by_name');

      // Act
      const result = await tool.handler({ name: 'Region' });

      // Assert
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.length).toBeLessThanOrEqual(10); // Default limit is 10
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const errorMessage = 'Network error';
      mockPsgcClient.getRegions = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('search_by_name');

      // Act
      const result = await tool.handler({ name: 'Region' });

      // Assert
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

    it('should_handle_case_insensitive_search', async () => {
      // Arrange
      const tool = registeredTools.get('search_by_name');

      // Act
      const result = await tool.handler({ name: 'region', type: 'region', limit: 10 });

      // Assert
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult).toHaveLength(2); // Should find regions regardless of case
    });
  });

  describe('get_hierarchy', () => {
    it('should_return_hierarchy_for_barangay_code', async () => {
      // Arrange
      const barangayCode = '012801001';
      mockPsgcClient.getBarangay = vi.fn().mockResolvedValue(mockBarangay);
      mockPsgcClient.getCityMunicipality = vi.fn().mockResolvedValue(mockMunicipalities[0]);
      mockPsgcClient.getProvince = vi.fn().mockResolvedValue(mockProvince);
      mockPsgcClient.getRegion = vi.fn().mockResolvedValue(mockRegion);
      mockPsgcClient.getIslandGroup = vi.fn().mockResolvedValue(mockIslandGroup);
      const tool = registeredTools.get('get_hierarchy');

      // Act
      const result = await tool.handler({ code: barangayCode });

      // Assert
      expect(mockPsgcClient.getBarangay).toHaveBeenCalledWith(barangayCode);
      expect(mockPsgcClient.getCityMunicipality).toHaveBeenCalledWith('012801000');
      expect(mockPsgcClient.getProvince).toHaveBeenCalledWith('012000000');
      expect(mockPsgcClient.getRegion).toHaveBeenCalledWith('010000000');
      expect(mockPsgcClient.getIslandGroup).toHaveBeenCalledWith('luzon');

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.entityType).toBe('barangay');
      expect(parsedResult.levels).toHaveLength(5); // island_group, region, province, city/municipality, barangay
    });

    it('should_return_hierarchy_for_region_code', async () => {
      // Arrange
      const regionCode = '010000000';
      mockPsgcClient.getRegion = vi.fn().mockResolvedValue(mockRegion);
      mockPsgcClient.getIslandGroup = vi.fn().mockResolvedValue(mockIslandGroup);
      const tool = registeredTools.get('get_hierarchy');

      // Act
      const result = await tool.handler({ code: regionCode });

      // Assert
      expect(mockPsgcClient.getRegion).toHaveBeenCalledWith(regionCode);
      expect(mockPsgcClient.getIslandGroup).toHaveBeenCalledWith('luzon');

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.entityType).toBe('region');
      expect(parsedResult.levels).toHaveLength(2); // island_group, region
    });

    it('should_return_error_for_invalid_code_format', async () => {
      // Arrange
      const invalidCode = '123';
      const tool = registeredTools.get('get_hierarchy');

      // Act
      const result = await tool.handler({ code: invalidCode });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'Error: Invalid code format - must be 9 digits',
          },
        ],
        isError: true,
      });
    });

    it('should_handle_api_errors_gracefully', async () => {
      // Arrange
      const regionCode = '010000000';
      const errorMessage = 'Region not found';
      mockPsgcClient.getRegion = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_hierarchy');

      // Act
      const result = await tool.handler({ code: regionCode });

      // Assert
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

  describe('validate_code', () => {
    it('should_validate_region_code_successfully', async () => {
      // Arrange
      const regionCode = '010000000';
      mockPsgcClient.getRegion = vi.fn().mockResolvedValue(mockRegion);
      const tool = registeredTools.get('validate_code');

      // Act
      const result = await tool.handler({ code: regionCode });

      // Assert
      expect(mockPsgcClient.getRegion).toHaveBeenCalledWith(regionCode);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.code).toBe(regionCode);
      expect(parsedResult.valid).toBe(true);
      expect(parsedResult.type).toBe('region');
      expect(parsedResult.data).toEqual(mockRegion);
    });

    it('should_validate_city_municipality_code_successfully', async () => {
      // Arrange
      const cityMunicipalityCode = '012801000'; // City/Municipality code: ends with 000 but substring(3,6) !== '000'
      mockPsgcClient.getCityMunicipality = vi.fn().mockResolvedValue(mockMunicipalities[0]);
      const tool = registeredTools.get('validate_code');

      // Act
      const result = await tool.handler({ code: cityMunicipalityCode });

      // Assert
      expect(mockPsgcClient.getCityMunicipality).toHaveBeenCalledWith(cityMunicipalityCode);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.code).toBe(cityMunicipalityCode);
      expect(parsedResult.valid).toBe(true);
      expect(parsedResult.type).toBe('city/municipality');
      expect(parsedResult.data).toEqual(mockMunicipalities[0]);
    });

    it('should_validate_barangay_code_successfully', async () => {
      // Arrange
      const barangayCode = '012801001';
      mockPsgcClient.getBarangay = vi.fn().mockResolvedValue(mockBarangay);
      const tool = registeredTools.get('validate_code');

      // Act
      const result = await tool.handler({ code: barangayCode });

      // Assert
      expect(mockPsgcClient.getBarangay).toHaveBeenCalledWith(barangayCode);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.code).toBe(barangayCode);
      expect(parsedResult.valid).toBe(true);
      expect(parsedResult.type).toBe('barangay');
      expect(parsedResult.data).toEqual(mockBarangay);
    });

    it('should_return_invalid_for_nonexistent_code', async () => {
      // Arrange
      const invalidCode = '999000000'; // This should be treated as a region code
      mockPsgcClient.getRegion = vi.fn().mockRejectedValue(new Error('Not found'));
      const tool = registeredTools.get('validate_code');

      // Act
      const result = await tool.handler({ code: invalidCode });

      // Assert
      expect(mockPsgcClient.getRegion).toHaveBeenCalledWith(invalidCode);
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.code).toBe(invalidCode);
      expect(parsedResult.valid).toBe(false);
      expect(parsedResult.type).toBe('region');
      expect(parsedResult.data).toBe(null);
    });

    it('should_handle_invalid_code_format', async () => {
      // Arrange
      const invalidCode = '123';
      const tool = registeredTools.get('validate_code');

      // Act
      const result = await tool.handler({ code: invalidCode });

      // Assert
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.code).toBe(invalidCode);
      expect(parsedResult.valid).toBe(false);
      expect(parsedResult.type).toBe(null);
      expect(parsedResult.data).toBe(null);
    });
  });

  describe('Edge Cases', () => {
    it('should_handle_empty_search_results_gracefully', async () => {
      // Arrange
      mockPsgcClient.getRegions = vi.fn().mockResolvedValue([]);
      mockPsgcClient.getProvinces = vi.fn().mockResolvedValue([]);
      mockPsgcClient.getCities = vi.fn().mockResolvedValue([]);
      mockPsgcClient.getMunicipalities = vi.fn().mockResolvedValue([]);
      mockPsgcClient.getBarangays = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('search_by_name');

      // Act
      const result = await tool.handler({ name: 'NonExistent' });

      // Assert
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult).toEqual([]);
    });

    it('should_handle_hierarchy_with_missing_parent_entities', async () => {
      // Arrange
      const barangayCode = '012801001';
      mockPsgcClient.getBarangay = vi.fn().mockResolvedValue(mockBarangay);
      mockPsgcClient.getCityMunicipality = vi.fn().mockRejectedValue(new Error('Not found'));
      const tool = registeredTools.get('get_hierarchy');

      // Act
      const result = await tool.handler({ code: barangayCode });

      // Assert
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.entityType).toBe('barangay');
      expect(parsedResult.levels).toHaveLength(1); // Only barangay level
    });
  });
});
