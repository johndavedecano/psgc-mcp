import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PSGCClient } from '../../../src/services/psgc-client.js';
import { registerDistrictTools } from '../../../src/tools/district.js';
import type {
  District,
  City,
  Municipality,
  CityMunicipality,
  SubMunicipality,
  Barangay,
} from '../../../src/types/psgc.types.js';

// Mock data for testing
const mockDistricts: District[] = [
  {
    code: '133900000',
    name: 'First District of Metro Manila',
    regionCode: '130000000',
    islandGroupCode: 'luzon',
  },
  {
    code: '174600000',
    name: 'Lone District of Siquijor',
    regionCode: '070000000',
    islandGroupCode: 'visayas',
  },
];

const mockDistrict: District = {
  code: '133900000',
  name: 'First District of Metro Manila',
  regionCode: '130000000',
  islandGroupCode: 'luzon',
};

const mockCities: City[] = [
  {
    code: '133901000',
    name: 'Manila',
    regionCode: '130000000',
    islandGroupCode: 'luzon',
    provinceCode: false,
    districtCode: '133900000',
    isCapital: true,
  },
];

const mockMunicipalities: Municipality[] = [
  {
    code: '174601000',
    name: 'Enrique Villanueva',
    regionCode: '070000000',
    islandGroupCode: 'visayas',
    provinceCode: '174600000',
    districtCode: '174600000',
  },
];

const mockCitiesMunicipalities: CityMunicipality[] = [
  {
    code: '133901000',
    name: 'Manila',
    regionCode: '130000000',
    islandGroupCode: 'luzon',
    provinceCode: false,
    districtCode: '133900000',
    isCapital: true,
    isCity: true,
  },
  {
    code: '174601000',
    name: 'Enrique Villanueva',
    regionCode: '070000000',
    islandGroupCode: 'visayas',
    provinceCode: '174600000',
    districtCode: '174600000',
    isMunicipality: true,
  },
];

const mockSubMunicipalities: SubMunicipality[] = [
  {
    code: '133901000',
    name: 'Sample Sub-Municipality',
    regionCode: '130000000',
    islandGroupCode: 'luzon',
    provinceCode: false,
    districtCode: '133900000',
  },
];

const mockBarangays: Barangay[] = [
  {
    code: '133901001',
    name: 'Barangay 1',
    regionCode: '130000000',
    islandGroupCode: 'luzon',
    provinceCode: '130000000',
    districtCode: '133900000',
    cityCode: '133901000',
  },
  {
    code: '133901002',
    name: 'Barangay 2',
    regionCode: '130000000',
    islandGroupCode: 'luzon',
    provinceCode: '130000000',
    districtCode: '133900000',
    cityCode: '133901000',
  },
];

describe('District Tools', () => {
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
      getDistricts: vi.fn(),
      getDistrict: vi.fn(),
      getDistrictCities: vi.fn(),
      getDistrictMunicipalities: vi.fn(),
      getDistrictCitiesMunicipalities: vi.fn(),
      getDistrictSubMunicipalities: vi.fn(),
      getDistrictBarangays: vi.fn(),
    } as any;

    // Register the tools
    registerDistrictTools(mockServer, mockPsgcClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
    registeredTools.clear();
  });

  describe('Tool Registration', () => {
    it('should register all district tools', () => {
      expect(mockServer.tool).toHaveBeenCalledTimes(7);
      expect(registeredTools.has('get_districts')).toBe(true);
      expect(registeredTools.has('get_district')).toBe(true);
      expect(registeredTools.has('get_district_cities')).toBe(true);
      expect(registeredTools.has('get_district_municipalities')).toBe(true);
      expect(registeredTools.has('get_district_cities_municipalities')).toBe(true);
      expect(registeredTools.has('get_district_sub_municipalities')).toBe(true);
      expect(registeredTools.has('get_district_barangays')).toBe(true);
    });

    it('should register tools with correct descriptions', () => {
      const getDistrictsTool = registeredTools.get('get_districts');
      const getDistrictTool = registeredTools.get('get_district');
      const getDistrictCitiesTool = registeredTools.get('get_district_cities');

      expect(getDistrictsTool.description).toBe('List all districts in the Philippines');
      expect(getDistrictTool.description).toBe('Get specific district by code');
      expect(getDistrictCitiesTool.description).toBe('Get all cities within a specific district');
    });
  });

  describe('get_districts', () => {
    it('should_return_all_districts_when_api_call_succeeds', async () => {
      // Arrange
      mockPsgcClient.getDistricts = vi.fn().mockResolvedValue(mockDistricts);
      const tool = registeredTools.get('get_districts');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getDistricts).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockDistricts, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const errorMessage = 'Network error';
      mockPsgcClient.getDistricts = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_districts');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getDistricts).toHaveBeenCalledTimes(1);
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
      mockPsgcClient.getDistricts = vi.fn().mockRejectedValue('String error');
      const tool = registeredTools.get('get_districts');

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

  describe('get_district', () => {
    it('should_return_specific_district_when_valid_code_provided', async () => {
      // Arrange
      const districtCode = '133900000';
      mockPsgcClient.getDistrict = vi.fn().mockResolvedValue(mockDistrict);
      const tool = registeredTools.get('get_district');

      // Act
      const result = await tool.handler({ code: districtCode });

      // Assert
      expect(mockPsgcClient.getDistrict).toHaveBeenCalledWith(districtCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockDistrict, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const districtCode = '133900000';
      const errorMessage = 'District not found';
      mockPsgcClient.getDistrict = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_district');

      // Act
      const result = await tool.handler({ code: districtCode });

      // Assert
      expect(mockPsgcClient.getDistrict).toHaveBeenCalledWith(districtCode);
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

  describe('get_district_cities', () => {
    it('should_return_cities_in_district_when_valid_code_provided', async () => {
      // Arrange
      const districtCode = '133900000';
      mockPsgcClient.getDistrictCities = vi.fn().mockResolvedValue(mockCities);
      const tool = registeredTools.get('get_district_cities');

      // Act
      const result = await tool.handler({ districtCode });

      // Assert
      expect(mockPsgcClient.getDistrictCities).toHaveBeenCalledWith(districtCode);
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
      const districtCode = '133900000';
      const errorMessage = 'Failed to fetch cities';
      mockPsgcClient.getDistrictCities = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_district_cities');

      // Act
      const result = await tool.handler({ districtCode });

      // Assert
      expect(mockPsgcClient.getDistrictCities).toHaveBeenCalledWith(districtCode);
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

  describe('get_district_municipalities', () => {
    it('should_return_municipalities_in_district_when_valid_code_provided', async () => {
      // Arrange
      const districtCode = '174600000';
      mockPsgcClient.getDistrictMunicipalities = vi.fn().mockResolvedValue(mockMunicipalities);
      const tool = registeredTools.get('get_district_municipalities');

      // Act
      const result = await tool.handler({ districtCode });

      // Assert
      expect(mockPsgcClient.getDistrictMunicipalities).toHaveBeenCalledWith(districtCode);
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
      const districtCode = '174600000';
      const errorMessage = 'Failed to fetch municipalities';
      mockPsgcClient.getDistrictMunicipalities = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_district_municipalities');

      // Act
      const result = await tool.handler({ districtCode });

      // Assert
      expect(mockPsgcClient.getDistrictMunicipalities).toHaveBeenCalledWith(districtCode);
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

  describe('get_district_cities_municipalities', () => {
    it('should_return_cities_and_municipalities_in_district_when_valid_code_provided', async () => {
      // Arrange
      const districtCode = '133900000';
      mockPsgcClient.getDistrictCitiesMunicipalities = vi
        .fn()
        .mockResolvedValue(mockCitiesMunicipalities);
      const tool = registeredTools.get('get_district_cities_municipalities');

      // Act
      const result = await tool.handler({ districtCode });

      // Assert
      expect(mockPsgcClient.getDistrictCitiesMunicipalities).toHaveBeenCalledWith(districtCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockCitiesMunicipalities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const districtCode = '133900000';
      const errorMessage = 'Failed to fetch cities and municipalities';
      mockPsgcClient.getDistrictCitiesMunicipalities = vi
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_district_cities_municipalities');

      // Act
      const result = await tool.handler({ districtCode });

      // Assert
      expect(mockPsgcClient.getDistrictCitiesMunicipalities).toHaveBeenCalledWith(districtCode);
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

  describe('get_district_sub_municipalities', () => {
    it('should_return_sub_municipalities_in_district_when_valid_code_provided', async () => {
      // Arrange
      const districtCode = '133900000';
      mockPsgcClient.getDistrictSubMunicipalities = vi
        .fn()
        .mockResolvedValue(mockSubMunicipalities);
      const tool = registeredTools.get('get_district_sub_municipalities');

      // Act
      const result = await tool.handler({ districtCode });

      // Assert
      expect(mockPsgcClient.getDistrictSubMunicipalities).toHaveBeenCalledWith(districtCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockSubMunicipalities, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const districtCode = '133900000';
      const errorMessage = 'Failed to fetch sub-municipalities';
      mockPsgcClient.getDistrictSubMunicipalities = vi
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_district_sub_municipalities');

      // Act
      const result = await tool.handler({ districtCode });

      // Assert
      expect(mockPsgcClient.getDistrictSubMunicipalities).toHaveBeenCalledWith(districtCode);
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

  describe('get_district_barangays', () => {
    it('should_return_barangays_in_district_when_valid_code_provided', async () => {
      // Arrange
      const districtCode = '133900000';
      mockPsgcClient.getDistrictBarangays = vi.fn().mockResolvedValue(mockBarangays);
      const tool = registeredTools.get('get_district_barangays');

      // Act
      const result = await tool.handler({ districtCode });

      // Assert
      expect(mockPsgcClient.getDistrictBarangays).toHaveBeenCalledWith(districtCode);
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
      const districtCode = '133900000';
      const errorMessage = 'Failed to fetch barangays';
      mockPsgcClient.getDistrictBarangays = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_district_barangays');

      // Act
      const result = await tool.handler({ districtCode });

      // Assert
      expect(mockPsgcClient.getDistrictBarangays).toHaveBeenCalledWith(districtCode);
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
      mockPsgcClient.getDistricts = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_districts');

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
      mockPsgcClient.getDistrict = vi.fn().mockResolvedValue(null);
      const tool = registeredTools.get('get_district');

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
  });
});
