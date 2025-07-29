import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PSGCClient } from '../../../src/services/psgc-client.js';
import { registerBarangayTools } from '../../../src/tools/barangay.js';
import type { Barangay } from '../../../src/types/psgc.types.js';

// Mock data for testing
const mockBarangays: Barangay[] = [
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

const mockBarangay: Barangay = {
  code: '012805001',
  name: 'Barangay 1',
  regionCode: '010000000',
  islandGroupCode: 'luzon',
  provinceCode: '012800000',
  cityCode: '012805000',
};

describe('Barangay Tools', () => {
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
      getBarangays: vi.fn(),
      getBarangay: vi.fn(),
    } as any;

    // Register the tools
    registerBarangayTools(mockServer, mockPsgcClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
    registeredTools.clear();
  });

  describe('Tool Registration', () => {
    it('should register all barangay tools', () => {
      expect(mockServer.tool).toHaveBeenCalledTimes(2);
      expect(registeredTools.has('get_barangays')).toBe(true);
      expect(registeredTools.has('get_barangay')).toBe(true);
    });

    it('should register tools with correct descriptions', () => {
      const getBarangaysTool = registeredTools.get('get_barangays');
      const getBarangayTool = registeredTools.get('get_barangay');

      expect(getBarangaysTool.description).toBe('List all barangays in the Philippines');
      expect(getBarangayTool.description).toBe('Get specific barangay by code');
    });
  });

  describe('get_barangays', () => {
    it('should_return_all_barangays_when_api_call_succeeds', async () => {
      // Arrange
      mockPsgcClient.getBarangays = vi.fn().mockResolvedValue(mockBarangays);
      const tool = registeredTools.get('get_barangays');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getBarangays).toHaveBeenCalledTimes(1);
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
      const errorMessage = 'Network error';
      mockPsgcClient.getBarangays = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_barangays');

      // Act
      const result = await tool.handler({});

      // Assert
      expect(mockPsgcClient.getBarangays).toHaveBeenCalledTimes(1);
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
      mockPsgcClient.getBarangays = vi.fn().mockRejectedValue('String error');
      const tool = registeredTools.get('get_barangays');

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

  describe('get_barangay', () => {
    it('should_return_specific_barangay_when_valid_code_provided', async () => {
      // Arrange
      const barangayCode = '012805001';
      mockPsgcClient.getBarangay = vi.fn().mockResolvedValue(mockBarangay);
      const tool = registeredTools.get('get_barangay');

      // Act
      const result = await tool.handler({ code: barangayCode });

      // Assert
      expect(mockPsgcClient.getBarangay).toHaveBeenCalledWith(barangayCode);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockBarangay, null, 2),
          },
        ],
      });
    });

    it('should_return_error_when_api_call_fails', async () => {
      // Arrange
      const barangayCode = '012805001';
      const errorMessage = 'Barangay not found';
      mockPsgcClient.getBarangay = vi.fn().mockRejectedValue(new Error(errorMessage));
      const tool = registeredTools.get('get_barangay');

      // Act
      const result = await tool.handler({ code: barangayCode });

      // Assert
      expect(mockPsgcClient.getBarangay).toHaveBeenCalledWith(barangayCode);
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
      mockPsgcClient.getBarangays = vi.fn().mockResolvedValue([]);
      const tool = registeredTools.get('get_barangays');

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
      mockPsgcClient.getBarangay = vi.fn().mockResolvedValue(null);
      const tool = registeredTools.get('get_barangay');

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
