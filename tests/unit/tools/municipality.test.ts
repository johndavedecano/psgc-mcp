import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PSGCClient } from '../../../src/services/psgc-client.js';
import { registerMunicipalityTools } from '../../../src/tools/municipality.js';
import type { Municipality, Barangay } from '../../../src/types/psgc.types.js';

// Mock data for testing
const mockMunicipalities: Municipality[] = [
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

const mockMunicipality: Municipality = {
  code: '012801000',
  name: 'Atok',
  regionCode: '010000000',
  islandGroupCode: 'luzon',
  provinceCode: '012800000',
};

const mockMunicipalityBarangays: Barangay[] = [
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

describe('Municipality Tools', () => {
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
      getMunicipalities: vi.fn(),
      getMunicipality: vi.fn(),
      getMunicipalityBarangays: vi.fn(),
    } as any;

    // Register the tools
    registerMunicipalityTools(mockServer, mockPsgcClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
    registeredTools.clear();
  });

  describe('Tool Registration', () => {
    it('should register all municipality tools', () => {
      expect(mockServer.tool).toHaveBeenCalledTimes(3);
      expect(registeredTools.has('get_municipalities')).toBe(true);
      expect(registeredTools.has('get_municipality')).toBe(true);
      expect(registeredTools.has('get_municipality_barangays')).toBe(true);
    });

    it('should register tools with correct descriptions', () => {
      const getMunicipalitiesTools = registeredTools.get('get_municipalities');
      const getMunicipalityTool = registeredTools.get('get_municipality');
      const getMunicipalityBarangaysTool = registeredTools.get('get_municipality_barangays');

      expect(getMunicipalitiesTools.description).toBe('List all municipalities in the Philippines');
      expect(getMunicipalityTool.description).toBe('Get specific municipality by code');
      expect(getMunicipalityBarangaysTool.description).toBe(
        'Get all barangays within a specific municipality'
      );
    });
  });

  describe('get_municipalities', () => {
    it('should_return_all_municipalities_when_api_call_succeeds', async () => {
      // Arrange
      mockPsgcClient.getMunicipalities = vi.fn().mockResolvedValue(mockMunicipalities);
      const tool = registeredTools.get('get_municipalities');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getMunicipalities).toHaveBeenCalledTimes(1);
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
      const errorMessage = 'Network error';
      mockPsgcClient.getMunicipalities = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_municipalities');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getMunicipalities).toHaveBeenCalledTimes(1);
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
      mockPsgcClient.getMunicipalities = vi.fn().mockRejectedValue('String error');
      const tool = registeredTools.get('get_municipalities');

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

  describe('get_municipality', () => {
    it('should_return_specific_municipality_when_valid_code_provided', async () => {
      // Arrange
      const municipalityCode = '012801000';
      mockPsgcClient.getMunicipality = vi.fn().mockResolvedValue(mockMunicipality);
      const tool = registeredTools.get('get_municipality');

      // Act
      const result = await tool.handler({ code: municipalityCode });

      // Assert
      expect(mockPsgcClient.getMunicipality).toHaveBeenCalledWith(municipalityCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockMunicipality, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const municipalityCode = '012801000';
      const errorMessage = 'Municipality not found';
      mockPsgcClient.getMunicipality = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_municipality');

      // Act
      const result = await tool.handler({ code: municipalityCode });

      // Assert
      expect(mockPsgcClient.getMunicipality).toHaveBeenCalledWith(municipalityCode);
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

  describe('get_municipality_barangays', () => {
    it('should_return_barangays_in_municipality_when_valid_code_provided', async () => {
      // Arrange
      const municipalityCode = '012801000';
      mockPsgcClient.getMunicipalityBarangays = vi
        .fn()
        .mockResolvedValue(mockMunicipalityBarangays);
      const tool = registeredTools.get('get_municipality_barangays');

      // Act
      const result = await tool.handler({ municipalityCode });

      // Assert
      expect(mockPsgcClient.getMunicipalityBarangays).toHaveBeenCalledWith(municipalityCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockMunicipalityBarangays, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const municipalityCode = '012801000';
      const errorMessage = 'Failed to fetch barangays';
      mockPsgcClient.getMunicipalityBarangays = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_municipality_barangays');

      // Act
      const result = await tool.handler({ municipalityCode });

      // Assert
      expect(mockPsgcClient.getMunicipalityBarangays).toHaveBeenCalledWith(municipalityCode);
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
      mockPsgcClient.getMunicipalities = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_municipalities');

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
      mockPsgcClient.getMunicipality = vi.fn().mockResolvedValue(null);
      const tool = registeredTools.get('get_municipality');

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
      const municipalityCode = '012801000';
      mockPsgcClient.getMunicipalityBarangays = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_municipality_barangays');

      // Act
      const result = await tool.handler({ municipalityCode });

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
