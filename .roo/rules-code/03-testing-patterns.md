# Testing Patterns for MCP Server

## Test Structure

```typescript
// Test file naming: [module].test.ts
describe("IslandGroupTools", () => {
  describe("get_island_groups", () => {
    it("should return all island groups", async () => {
      // Test implementation
    });

    it("should handle API errors gracefully", async () => {
      // Test implementation
    });
  });
});
```

## Mocking Strategy

```typescript
// Mock PSGC API client
const mockPsgcClient = {
  getIslandGroups: jest.fn(),
  getIslandGroup: jest.fn(),
  // ... other methods
};

// Mock MCP server
const mockServer = {
  tool: jest.fn(),
  resource: jest.fn(),
  prompt: jest.fn(),
};
```

## Test Data Factory

```typescript
// Test data factories for consistent test data
const createMockIslandGroup = (overrides = {}) => ({
  code: "010000000",
  name: "Luzon",
  population: 50000000,
  ...overrides,
});

const createMockRegion = (overrides = {}) => ({
  code: "130000000",
  name: "National Capital Region",
  islandGroupCode: "010000000",
  ...overrides,
});
```

## Integration Test Patterns

```typescript
describe("API Integration", () => {
  it("should fetch real data from PSGC API", async () => {
    const client = new PSGCClient();
    const regions = await client.getRegions();

    expect(regions).toBeInstanceOf(Array);
    expect(regions.length).toBeGreaterThan(0);
    expect(regions[0]).toHaveProperty("code");
    expect(regions[0]).toHaveProperty("name");
  });
});
```

## Performance Testing

```typescript
describe("Performance Tests", () => {
  it("should respond within 100ms for cached data", async () => {
    const start = Date.now();
    const result = await tool.getIslandGroups();
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });

  it("should handle 100 concurrent requests", async () => {
    const promises = Array(100)
      .fill(null)
      .map(() => tool.getRegions());

    const results = await Promise.all(promises);
    expect(results).toHaveLength(100);
    results.forEach((result) => {
      expect(result).toBeDefined();
    });
  });
});
```

## Error Scenario Testing

```typescript
describe("Error Handling", () => {
  it("should handle network timeout", async () => {
    mockPsgcClient.getIslandGroups.mockRejectedValue(
      new Error("Network timeout")
    );

    const result = await tool.getIslandGroups();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Network timeout");
  });

  it("should handle invalid PSGC codes", async () => {
    const result = await tool.getRegion({ code: "invalid-code" });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid code format");
  });
});
```

## Test Coverage Requirements

- **Unit Tests**: 90%+ coverage for all modules
- **Integration Tests**: Cover all API endpoints
- **Error Scenarios**: Test all error paths
- **Performance Tests**: Critical path performance validation
- **Edge Cases**: Empty results, malformed data, boundary values

## Continuous Testing

```json
// package.json scripts
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:integration": "jest --config jest.integration.config.js",
  "test:performance": "jest --config jest.performance.config.js"
}
```
