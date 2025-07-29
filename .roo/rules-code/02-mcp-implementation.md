# MCP Implementation Guidelines

## Tool Structure Template

```typescript
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerIslandGroupTools(server: McpServer) {
  server.tool(
    "get_island_groups",
    "List all island groups in the Philippines",
    {},
    async () => {
      try {
        const data = await psgcClient.getIslandGroups();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
```

## Parameter Validation

- **Required Parameters**: Mark with zod `.required()`
- **Optional Parameters**: Use `.optional()` with sensible defaults
- **Code Validation**: Validate PSGC codes against known patterns
- **Type Validation**: Ensure correct data types for all inputs

## Response Format Standards

```typescript
// Success response
{
  content: [{
    type: 'text',
    text: JSON.stringify(data, null, 2)
  }]
}

// Error response
{
  content: [{
    type: 'text',
    text: 'Error: [descriptive message]'
  }],
  isError: true
}
```

## Tool Categories Implementation Order

1. **Geographic Entities** (follow hierarchy):
   - Island Groups → Regions → Provinces → Cities/Municipalities → Barangays
2. **Search Tools**: Implement after basic entity tools
3. **Validation Tools**: Code validation and hierarchy tools
4. **Advanced Features**: Filtering, pagination, caching

## Resource Implementation

```typescript
// Static resources
server.resource("island-groups", "psgc://island-groups", async () => ({
  contents: [
    {
      uri: "psgc://island-groups",
      mimeType: "application/json",
      text: JSON.stringify(islandGroups),
    },
  ],
}));

// Dynamic resources
server.resource(
  "region-provinces",
  "psgc://regions/{code}/provinces",
  async (uri, { code }) => {
    const provinces = await psgcClient.getRegionProvinces(code);
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(provinces),
        },
      ],
    };
  }
);
```

## Prompt Templates

```typescript
// Discovery prompt
server.prompt(
  "explore-philippines",
  "Explore Philippine geographic hierarchy",
  {
    startFrom: z
      .enum(["island-groups", "regions", "provinces"])
      .default("island-groups"),
  },
  async ({ startFrom }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Let's explore the Philippines starting from ${startFrom}. What would you like to know?`,
          },
        },
      ],
    };
  }
);
```

## Caching Strategy

- **Tool Results**: Cache based on parameters
- **API Responses**: Cache with TTL based on data volatility
- **Static Data**: Cache indefinitely with cache invalidation
- **Cache Keys**: Use consistent key generation for cache hits

## Error Handling Patterns

```typescript
// API errors
class PSGCApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "PSGCApiError";
  }
}

// Validation errors
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}
```
