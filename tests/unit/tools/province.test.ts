import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PSGCClient } from '../../../src/services/psgc-client.js';
import { registerProvinceTools } from '../../../src/tools/province.js';
import type {
  Province,
  City,
  Municipality,
  CityMunicipality,
  SubMunicipality,
  Barangay,
} from '../../../src/types/psgc.types.js';

// Mock data for testing
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

const mockProvince: Province = {
  code: '012800000',
  name: 'Benguet',
  regionCode: '010000000',
  islandGroupCode: 'luzon',
};

const mockProvinceCities: City[] = [
  {
    code: '012805000',
    name: 'Baguio City',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: false,
    isCapital: false,
  },
];

const mockProvinceMunicipalities: Municipality[] = [
  {
    code: '012801000',
    name: 'Atok',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
  },
  {
    code: '012802000',
    name: 'Bagulin',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
  },
];

const mockProvinceCitiesMunicipalities: CityMunicipality[] = [
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

const mockProvinceSubMunicipalities: SubMunicipality[] = [
  {
    code: '012801000',
    name: 'Sample Sub-Municipality',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
  },
];

const mockProvinceBarangays: Barangay[] = [
  {
    code: '012801001',
    name: 'Barangay 1',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
    municipalityCode: '012801000',
  },
  {
    code: '012801002',
    name: 'Barangay 2',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
    municipalityCode: '012801000',
  },
];

describe('Province Tools', () => {
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
      getProvinces: vi.fn(),
      getProvince: vi.fn(),
      getProvinceCities: vi.fn(),
      getProvinceMunicipalities: vi.fn(),
      getProvinceCitiesMunicipalities: vi.fn(),
      getProvinceSubMunicipalities: vi.fn(),
      getProvinceBarangays: vi.fn(),
    } as any;

    // Register the tools
    registerProvinceTools(mockServer, mockPsgcClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
    registeredTools.clear();
  });

  describe('Tool Registration', () => {
    it('should register all province tools', () => {
      expect(mockServer.tool).toHaveBeenCalledTimes(7);
      expect(registeredTools.has('get_provinces')).toBe(true);
      expect(registeredTools.has('get_province')).toBe(true);
      expect(registeredTools.has('get_province_cities')).toBe(true);
      expect(registeredTools.has('get_province_municipalities')).toBe(true);
      expect(registeredTools.has('get_province_cities_municipalities')).toBe(true);
      expect(registeredTools.has('get_province_sub_municipalities')).toBe(true);
      expect(registeredTools.has('get_province_barangays')).toBe(true);
    });

    it('should register tools with correct descriptions', () => {
      const getProvincesTool = registeredTools.get('get_provinces');
      const getProvinceTool = registeredTools.get('get_province');
      const getProvinceCitiesTool = registeredTools.get('get_province_cities');

      expect(getProvincesTool.description).toBe('List all provinces in the Philippines');
      expect(getProvinceTool.description).toBe('Get specific province by code');
      expect(getProvinceCitiesTool.description).toBe('Get all cities within a specific province');
    });
  });

  describe('get_provinces', () => {
    it('should_return_all_provinces_when_api_call_succeeds', async () => {
      // Arrange
      mockPsgcClient.getProvinces = vi.fn().mockResolvedValue(mockProvinces);
      const tool = registeredTools.get('get_provinces');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getProvinces).toHaveBeenCalledTimes(1);
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
      const errorMessage = 'Network error';
      mockPsgcClient.getProvinces = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_provinces');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getProvinces).toHaveBeenCalledTimes(1);
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
      mockPsgcClient.getProvinces = vi.fn().mockRejectedValue('String error');
      const tool = registeredTools.get('get_provinces');

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

  describe('get_province', () => {
    it('should_return_specific_province_when_valid_code_provided', async () => {
      // Arrange
      const provinceCode = '012800000';
      mockPsgcClient.getProvince = vi.fn().mockResolvedValue(mockProvince);
      const tool = registeredTools.get('get_province');

      // Act
      const result = await tool.handler({ code: provinceCode });

      // Assert
      expect(mockPsgcClient.getProvince).toHaveBeenCalledWith(provinceCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockProvince, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const provinceCode = '012800000';
      const errorMessage = 'Province not found';
      mockPsgcClient.getProvince = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_province');

      // Act
      const result = await tool.handler({ code: provinceCode });

      // Assert
      expect(mockPsgcClient.getProvince).toHaveBeenCalledWith(provinceCode);
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

  describe('get_province_cities', () => {
    it('should_return_cities_in_province_when_valid_code_provided', async () => {
      // Arrange
      const provinceCode = '012800000';
      mockPsgcClient.getProvinceCities = vi.fn().mockResolvedValue(mockProvinceCities);
      const tool = registeredTools.get('get_province_cities');

      // Act
      const result = await tool.handler({ provinceCode });

      // Assert
      expect(mockPsgcClient.getProvinceCities).toHaveBeenCalledWith(provinceCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockProvinceCities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const provinceCode = '012800000';
      const errorMessage = 'Failed to fetch cities';
      mockPsgcClient.getProvinceCities = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_province_cities');

      // Act
      const result = await tool.handler({ provinceCode });

      // Assert
      expect(mockPsgcClient.getProvinceCities).toHaveBeenCalledWith(provinceCode);
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

  describe('get_province_municipalities', () => {
    it('should_return_municipalities_in_province_when_valid_code_provided', async () => {
      // Arrange
      const provinceCode = '012800000';
      mockPsgcClient.getProvinceMunicipalities = vi
        .fn()
        .mockResolvedValue(mockProvinceMunicipalities);
      const tool = registeredTools.get('get_province_municipalities');

      // Act
      const result = await tool.handler({ provinceCode });

      // Assert
      expect(mockPsgcClient.getProvinceMunicipalities).toHaveBeenCalledWith(provinceCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockProvinceMunicipalities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const provinceCode = '012800000';
      const errorMessage = 'Failed to fetch municipalities';
      mockPsgcClient.getProvinceMunicipalities = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_province_municipalities');

      // Act
      const result = await tool.handler({ provinceCode });

      // Assert
      expect(mockPsgcClient.getProvinceMunicipalities).toHaveBeenCalledWith(provinceCode);
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

  describe('get_province_cities_municipalities', () => {
    it('should_return_cities_and_municipalities_in_province_when_valid_code_provided', async () => {
      // Arrange
      const provinceCode = '012800000';
      mockPsgcClient.getProvinceCitiesMunicipalities = vi
        .fn()
        .mockResolvedValue(mockProvinceCitiesMunicipalities);
      const tool = registeredTools.get('get_province_cities_municipalities');

      // Act
      const result = await tool.handler({ provinceCode });

      // Assert
      expect(mockPsgcClient.getProvinceCitiesMunicipalities).toHaveBeenCalledWith(provinceCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockProvinceCitiesMunicipalities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const provinceCode = '012800000';
      const errorMessage = 'Failed to fetch cities and municipalities';
      mockPsgcClient.getProvinceCitiesMunicipalities = vi
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_province_cities_municipalities');

      // Act
      const result = await tool.handler({ provinceCode });

      // Assert
      expect(mockPsgcClient.getProvinceCitiesMunicipalities).toHaveBeenCalledWith(provinceCode);
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

  describe('get_province_sub_municipalities', () => {
    it('should_return_sub_municipalities_in_province_when_valid_code_provided', async () => {
      // Arrange
      const provinceCode = '012800000';
      mockPsgcClient.getProvinceSubMunicipalities = vi
        .fn()
        .mockResolvedValue(mockProvinceSubMunicipalities);
      const tool = registeredTools.get('get_province_sub_municipalities');

      // Act
      const result = await tool.handler({ provinceCode });

      // Assert
      expect(mockPsgcClient.getProvinceSubMunicipalities).toHaveBeenCalledWith(provinceCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockProvinceSubMunicipalities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const provinceCode = '012800000';
      const errorMessage = 'Failed to fetch sub-municipalities';
      mockPsgcClient.getProvinceSubMunicipalities = vi
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_province_sub_municipalities');

      // Act
      const result = await tool.handler({ provinceCode });

      // Assert
      expect(mockPsgcClient.getProvinceSubMunicipalities).toHaveBeenCalledWith(provinceCode);
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

  describe('get_province_barangays', () => {
    it('should_return_barangays_in_province_when_valid_code_provided', async () => {
      // Arrange
      const provinceCode = '012800000';
      mockPsgcClient.getProvinceBarangays = vi.fn().mockResolvedValue(mockProvinceBarangays);
      const tool = registeredTools.get('get_province_barangays');

      // Act
      const result = await tool.handler({ provinceCode });

      // Assert
      expect(mockPsgcClient.getProvinceBarangays).toHaveBeenCalledWith(provinceCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockProvinceBarangays, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const provinceCode = '012800000';
      const errorMessage = 'Failed to fetch barangays';
      mockPsgcClient.getProvinceBarangays = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_province_barangays');

      // Act
      const result = await tool.handler({ provinceCode });

      // Assert
      expect(mockPsgcClient.getProvinceBarangays).toHaveBeenCalledWith(provinceCode);
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
      mockPsgcClient.getProvinces = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_provinces');

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
      mockPsgcClient.getProvince = vi.fn().mockResolvedValue(null);
      const tool = registeredTools.get('get_province');

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

    it('should_handle_empty_cities_list_gracefully', async () => {
      // Arrange
      const provinceCode = '012800000';
      mockPsgcClient.getProvinceCities = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_province_cities');

      // Act
      const result = await tool.handler({ provinceCode });

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
