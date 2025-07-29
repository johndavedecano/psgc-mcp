# Testing Requirements for PSGC MCP Server

## Unit Testing Standards

1. **Coverage Target**: Aim for 90%+ code coverage
2. **Test Structure**: Organize tests to mirror source structure
3. **Naming**: Use descriptive test names following pattern: `should_[expected_behavior]_when_[condition]`
4. **Testing Framework**: Use Vitest instead of Jest for faster execution and better TypeScript support

## Test Categories

### API Client Tests

- Test successful API responses for each endpoint
- Test error handling for network failures
- Test timeout scenarios
- Test rate limiting behavior
- Test caching functionality
- Test content-type negotiation (JSON vs HTML)

### Tool Tests

- Test each tool with valid inputs
- Test tool behavior with invalid inputs
- Test edge cases (empty results, malformed data)
- Test parameter validation
- Test error propagation

### Integration Tests

- Test against actual PSGC API (with rate limiting)
- Test tool combinations and workflows
- Test performance with large datasets
- Test error recovery mechanisms

## Test Data Requirements

- Use realistic test data from PSGC API
- Include edge cases (special characters, long names)
- Test with various geographic code formats
- Include tests for hierarchical relationships

## Performance Testing

- Test response times for each tool
- Test memory usage with large result sets
- Test caching effectiveness
- Test concurrent request handling

## Test Organization

```
tests/
├── unit/
│   ├── services/
│   │   ├── psgc-client.test.ts
│   │   └── cache.service.test.ts
│   ├── tools/
│   │   ├── island-group.test.ts
│   │   ├── region.test.ts
│   │   └── ... (other tool tests)
│   └── utils/
│       ├── validation.test.ts
│       └── formatting.test.ts
├── integration/
│   ├── api-integration.test.ts
│   └── tool-workflows.test.ts
└── fixtures/
    ├── mock-responses/
    └── test-data/
```

## Continuous Integration

- Run tests on every commit
- Include performance benchmarks in CI
- Generate coverage reports
- Validate against multiple Node.js versions
