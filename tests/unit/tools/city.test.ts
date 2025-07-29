import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PSGCClient } from '../../../src/services/psgc-client.js';
import { registerCityTools } from '../../../src/tools/city.js';
import type { City, Barangay } from '../../../src/types/psgc.types.js';

// Mock data for testing
const mockCities: City[] = [
  {
    code: '012805000',
    name: 'Baguio City',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: false,
    isCapital: false,
  },
  {
    code: '133901000',
    name: 'Manila',
    regionCode: '130000000',
    islandGroupCode: 'luzon',
    provinceCode: false,
    isCapital: true,
  },
];

const mockCity: City = {
  code: '012805000',
  name: 'Baguio City',
  regionCode: '010000000',
  islandGroupCode: 'luzon',
  provinceCode: false,
  isCapital: false,
};

const mockCityBarangays: Barangay[] = [
  {
    code: '012805001',
    name: 'Barangay 1',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
    cityCode: '012805000',
  },
  {
    code: '012805002',
    name: 'Barangay 2',
    regionCode: '010000000',
    islandGroupCode: 'luzon',
    provinceCode: '012800000',
    cityCode: '012805000',
  },
];

describe('City Tools', () => {
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
      getCities: vi.fn(),
      getCity: vi.fn(),
      getCityBarangays: vi.fn(),
    } as any;

    // Register the tools
    registerCityTools(mockServer, mockPsgcClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
    registeredTools.clear();
  });

  describe('Tool Registration', () => {
    it('should register all city tools', () => {
      expect(mockServer.tool).toHaveBeenCalledTimes(3);
      expect(registeredTools.has('get_cities')).toBe(true);
      expect(registeredTools.has('get_city')).toBe(true);
      expect(registeredTools.has('get_city_barangays')).toBe(true);
    });

    it('should register tools with correct descriptions', () => {
      const getCitiesTool = registeredTools.get('get_cities');
      const getCityTool = registeredTools.get('get_city');
      const getCityBarangaysTool = registeredTools.get('get_city_barangays');

      expect(getCitiesTool.description).toBe('List all cities in the Philippines');
      expect(getCityTool.description).toBe('Get specific city by code');
      expect(getCityBarangaysTool.description).toBe('Get all barangays within a specific city');
    });
  });

  describe('get_cities', () => {
    it('should_return_all_cities_when_api_call_succeeds', async () => {
      // Arrange
      mockPsgcClient.getCities = vi.fn().mockResolvedValue(mockCities);
      const tool = registeredTools.get('get_cities');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getCities).toHaveBeenCalledTimes(1);
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
      const errorMessage = 'Network error';
      mockPsgcClient.getCities = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_cities');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getCities).toHaveBeenCalledTimes(1);
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
      mockPsgcClient.getCities = vi.fn().mockRejectedValue('String error');
      const tool = registeredTools.get('get_cities');

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

  describe('get_city', () => {
    it('should_return_specific_city_when_valid_code_provided', async () => {
      // Arrange
      const cityCode = '012805000';
      mockPsgcClient.getCity = vi.fn().mockResolvedValue(mockCity);
      const tool = registeredTools.get('get_city');

      // Act
      const result = await tool.handler({ code: cityCode });

      // Assert
      expect(mockPsgcClient.getCity).toHaveBeenCalledWith(cityCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockCity, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const cityCode = '012805000';
      const errorMessage = 'City not found';
      mockPsgcClient.getCity = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_city');

      // Act
      const result = await tool.handler({ code: cityCode });

      // Assert
      expect(mockPsgcClient.getCity).toHaveBeenCalledWith(cityCode);
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

  describe('get_city_barangays', () => {
    it('should_return_barangays_in_city_when_valid_code_provided', async () => {
      // Arrange
      const cityCode = '012805000';
      mockPsgcClient.getCityBarangays = vi.fn().mockResolvedValue(mockCityBarangays);
      const tool = registeredTools.get('get_city_barangays');

      // Act
      const result = await tool.handler({ cityCode });

      // Assert
      expect(mockPsgcClient.getCityBarangays).toHaveBeenCalledWith(cityCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockCityBarangays, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const cityCode = '012805000';
      const errorMessage = 'Failed to fetch barangays';
      mockPsgcClient.getCityBarangays = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_city_barangays');

      // Act
      const result = await tool.handler({ cityCode });

      // Assert
      expect(mockPsgcClient.getCityBarangays).toHaveBeenCalledWith(cityCode);
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
      mockPsgcClient.getCities = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_cities');

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
      mockPsgcClient.getCity = vi.fn().mockResolvedValue(null);
      const tool = registeredTools.get('get_city');

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

    it('should_handle_empty_barangays_list_gracefully', async () => {
      // Arrange
      const cityCode = '012805000';
      mockPsgcClient.getCityBarangays = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_city_barangays');

      // Act
      const result = await tool.handler({ cityCode });

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
