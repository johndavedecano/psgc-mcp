# PSGC MCP Server

A Model Context Protocol (MCP) server that provides access to the Philippine Standard Geographic Code (PSGC) API, offering hierarchical geographic data for the Philippines.

## Features

- **Complete Geographic Hierarchy**: Access to island groups, regions, provinces, cities, municipalities, barangays, and districts
- **Search Capabilities**: Find geographic entities by name across all levels
- **Code Validation**: Validate PSGC codes and get complete hierarchy information
- **Real-time Data**: Direct access to the official PSGC API
- **Type-safe**: Built with TypeScript for reliable data structures

## Installation

### From NPM (Published Package)

```bash
npm install -g psgc-mcp
```

### Configuration for MCP Clients

#### Cursor/Windsurf

Add to your MCP configuration file:

```json
{
  "mcpServers": {
    "psgc-mcp": {
      "command": "npx",
      "args": ["-y", "psgc-mcp"],
      "transport": "stdio"
    }
  }
}
```

#### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "psgc-mcp": {
      "command": "npx",
      "args": ["-y", "psgc-mcp"],
      "transport": "stdio"
    }
  }
}
```

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run locally: `npm start`

## Available Tools

The server provides a comprehensive set of tools for accessing PSGC data, categorized by geographic level.

### Island Group Tools

- `get_island_groups`: List all island groups.
- `get_island_group`: Get a specific island group by its code (e.g., `"luzon"`).
- `get_island_group_regions`: Get all regions within a specific island group.
- `get_island_group_provinces`: Get all provinces within a specific island group.
- `get_island_group_districts`: Get all districts within a specific island group.
- `get_island_group_cities`: Get all cities within a specific island group.
- `get_island_group_municipalities`: Get all municipalities within a specific island group.
- `get_island_group_cities_municipalities`: Get all cities and municipalities within a specific island group.
- `get_island_group_sub_municipalities`: Get all sub-municipalities within a specific island group.
- `get_island_group_barangays`: Get all barangays within a specific island group.

### Region Tools

- `get_regions`: List all regions.
- `get_region`: Get a specific region by its code (e.g., `"130000000"`).
- `get_region_provinces`: Get all provinces within a specific region.
- `get_region_districts`: Get all districts within a specific region.
- `get_region_cities`: Get all cities within a specific region.
- `get_region_municipalities`: Get all municipalities within a specific region.
- `get_region_cities_municipalities`: Get all cities and municipalities within a specific region.
- `get_region_sub_municipalities`: Get all sub-municipalities within a specific region.
- `get_region_barangays`: Get all barangays within a specific region.

### Province Tools

- `get_provinces`: List all provinces.
- `get_province`: Get a specific province by its code (e.g., `"012800000"`).
- `get_province_cities`: Get all cities within a specific province.
- `get_province_municipalities`: Get all municipalities within a specific province.
- `get_province_cities_municipalities`: Get all cities and municipalities within a specific province.
- `get_province_sub_municipalities`: Get all sub-municipalities within a specific province.
- `get_province_barangays`: Get all barangays within a specific province.

### District Tools

- `get_districts`: List all districts.
- `get_district`: Get a specific district by its code (e.g., `"133900000"`).
- `get_district_cities`: Get all cities within a specific district.
- `get_district_municipalities`: Get all municipalities within a specific district.
- `get_district_cities_municipalities`: Get all cities and municipalities within a specific district.
- `get_district_sub_municipalities`: Get all sub-municipalities within a specific district.
- `get_district_barangays`: Get all barangays within a specific district.

### City Tools

- `get_cities`: List all cities.
- `get_city`: Get a specific city by its code (e.g., `"012805000"`).
- `get_city_barangays`: Get all barangays within a specific city.

### Municipality Tools

- `get_municipalities`: List all municipalities.
- `get_municipality`: Get a specific municipality by its code (e.g., `"012801000"`).
- `get_municipality_barangays`: Get all barangays within a specific municipality.

### Sub-Municipality Tools

- `get_sub_municipalities`: List all sub-municipalities.
- `get_sub_municipality`: Get a specific sub-municipality by its code (e.g., `"133901000"`).
- `get_sub_municipality_barangays`: Get all barangays within a specific sub-municipality.

### Combined City/Municipality Tools

- `get_cities_municipalities`: List all cities and municipalities.
- `get_city_municipality`: Get a specific city or municipality by its code.
- `get_city_municipality_barangays`: Get all barangays within a specific city or municipality.

### Barangay Tools

- `get_barangays`: List all barangays.
- `get_barangay`: Get a specific barangay by its code (e.g., `"012805001"`).

### Search and Discovery Tools

- `search_by_name`: Search for geographic entities by name across all levels.
- `get_hierarchy`: Get the complete hierarchy for a specific PSGC code.
- `validate_code`: Validate if a geographic code exists and get its details.

## Available Resources

- **Static Data**: Access pre-loaded static data for all geographic levels.
- **Dynamic Queries**: Perform parameterized queries to fetch specific datasets.
- **Hierarchical Data**: Use resource templates to retrieve complete hierarchical information for any given PSGC code.

## Available Templates (Prompts)

- **Common Queries**: Use pre-defined prompts for common geographic questions (e.g., "What is the capital of [province]?").
- **Guided Discovery**: Interactive prompts to help you explore the geographic hierarchy.
- **Data Validation**: Prompts to validate PSGC codes and geographic names.

## Usage Examples

### Get All Regions

```json
{
  "tool": "get_regions",
  "arguments": {}
}
```

### Get Provinces in a Region

````json
{
  "tool": "get_provinces",
  "arguments": {
    "region_code": "130000000"
  }
}
```

### Search by Name
```json
{
  "tool": "search_by_name",
  "arguments": {
    "query": "Manila",
    "type": "city"
  }
}
````

### Get Complete Hierarchy

```json
{
  "tool": "get_hierarchy",
  "arguments": {
    "code": "133900000"
  }
}
```

## API Reference

The server connects to the official PSGC API at `https://psgc.gitlab.io/api/`.

### PSGC Code Format

PSGC codes follow a hierarchical format:

- **Island Groups**: 010000000, 020000000, 030000000
- **Regions**: 130000000 (NCR), 140000000 (CAR), etc.
- **Provinces**: 133900000 (Manila), 137400000 (Cebu), etc.
- **Cities/Municipalities**: 133903000 (Manila City), 137404000 (Cebu City), etc.
- **Barangays**: 133903001 (Barangay 1, Manila), etc.

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

```bash
git clone https://github.com/your-username/psgc-mcp.git
cd psgc-mcp
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

### Inspect with MCP Inspector

```bash
npm run inspect
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit your changes: `git commit -am 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/your-username/psgc-mcp/issues).
