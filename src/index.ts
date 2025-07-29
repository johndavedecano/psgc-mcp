#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create an MCP server
const server = new McpServer({
  name: "psgc-mcp",
  version: "1.0.0",
});

// TODO: Register tools and resources here
// Example:
// server.tool("get_island_groups", "List all island groups", {}, async () => {
//   return {
//     content: [
//       {
//         type: "text",
//         text: "Island groups data will be implemented here"
//       }
//     ]
//   };
// });

// Start receiving messages on stdin and sending messages on stdout
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Start the server
main().catch((error: Error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
