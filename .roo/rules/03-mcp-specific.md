# MCP Server Implementation Rules

## Tool Development Guidelines

1. **Tool Structure**: Each tool should follow the MCP tool specification
2. **Parameter Validation**: Use Zod schemas for all input validation
3. **Error Responses**: Return user-friendly error messages
4. **Documentation**: Include clear descriptions and examples for each tool
5. **Performance**: Implement caching for frequently accessed data

## Required Tools Implementation Order

Follow the phases outlined in mcp.md:

### Phase 4 Priority Order

1. **Core Geographic Tools** (implement in this order):

   - Island Group tools (`get_island_groups`, `get_island_group`, etc.)
   - Region tools (`get_regions`, `get_region`, etc.)
   - Province tools (`get_provinces`, `get_province`, etc.)
   - City tools (`get_cities`, `get_city`, etc.)
   - Municipality tools (`get_municipalities`, `get_municipality`, etc.)
   - Barangay tools (`get_barangays`, `get_barangay`, etc.)
   - District tools (`get_districts`, `get_district`, etc.)

2. **Search and Discovery Tools**:
   - `search_by_name` - Search across all entity types
   - `get_hierarchy` - Get complete hierarchy for a code
   - `validate_code` - Validate geographic codes

## API Client Standards

- **Base URL**: Always use https://psgc.gitlab.io/api
- **Content Types**: Handle both JSON and HTML responses
- **Caching**: Implement response caching with configurable TTL
- **Rate Limiting**: Respect API rate limits with exponential backoff
- **Error Handling**: Handle network errors, timeouts, and API errors

## Response Format Standards

- **Success**: Return structured data matching TypeScript interfaces
- **Errors**: Return clear error messages with appropriate HTTP status codes
- **Empty Results**: Return empty arrays/objects instead of null/undefined
- **Consistency**: Maintain consistent response structure across all tools

## Security Requirements

- **Input Validation**: Validate all parameters before API calls
- **Output Sanitization**: Sanitize all data returned to clients
- **HTTPS Only**: All API calls must use HTTPS
- **Rate Limiting**: Implement per-client rate limiting
- **Error Information**: Don't expose internal system details in errors

## Resource Implementation

- **Static Resources**: Provide access to static geographic data
- **Dynamic Resources**: Support parameterized queries
- **Hierarchical Resources**: Enable navigation through geographic hierarchy
- **Caching**: Cache resource responses appropriately

## Prompt Guidelines

- **Common Queries**: Create prompts for frequent geographic questions
- **Discovery**: Implement guided discovery for exploring data
- **Validation**: Add prompts for validating user inputs
- **Examples**: Include usage examples in all prompts
