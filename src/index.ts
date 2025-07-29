#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { psgcClient } from './services/psgc-client.js';
import {
  registerIslandGroupTools,
  registerRegionTools,
  registerProvinceTools,
  registerCityTools,
  registerMunicipalityTools,
  registerBarangayTools,
  registerDistrictTools,
  registerSearchTools,
} from './tools/index.js';

// Create an MCP server
const server = new McpServer({
  name: 'psgc-mcp',
  version: '1.0.0',
});

// Register all tools
registerIslandGroupTools(server, psgcClient);
registerRegionTools(server, psgcClient);
registerProvinceTools(server, psgcClient);
registerCityTools(server, psgcClient);
registerMunicipalityTools(server, psgcClient);
registerBarangayTools(server, psgcClient);
registerDistrictTools(server, psgcClient);
registerSearchTools(server, psgcClient);

// Start receiving messages on stdin and sending messages on stdout
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Start the server
main().catch((error: Error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
