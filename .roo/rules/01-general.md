# General Rules for PSGC MCP Server Development

## Project Overview

This project implements a Model Context Protocol (MCP) server for accessing the Philippine Standard Geographic Code (PSGC) API, providing hierarchical geographic data for the Philippines.

## Core Principles

1. **Type Safety First**: Always use TypeScript with strict mode enabled
2. **API Reliability**: Implement proper error handling, caching, and retry logic
3. **Performance Focus**: Use response caching, connection pooling, and pagination
4. **Security**: Validate all inputs, sanitize outputs, use HTTPS only
5. **Documentation**: Maintain comprehensive JSDoc comments for all public APIs

## Development Standards

- Use TypeScript for all new code
- Follow the established project structure in `mcp.md`
- Write unit tests for all functions and tools
- Use descriptive variable and function names
- Add error handling for all external API calls
- Implement proper logging for debugging

## Code Organization

- Keep the modular structure defined in the implementation plan
- Separate concerns: types, services, tools, resources, prompts
- Use consistent naming conventions across all files
- Maintain clear separation between API client and MCP implementation

## Testing Requirements

- Unit tests for all tools and services
- Integration tests with actual PSGC API
- Test error scenarios and edge cases
- Performance testing for large datasets
- Validate all input parameters and responses

## Documentation Standards

- JSDoc comments for all public methods
- README files for each major component
- Usage examples for all tools
- API endpoint mapping documentation
- Deployment and setup instructions
