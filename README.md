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

### Geographic Entity Tools

- `get_island_groups` - List all island groups (Luzon, Visayas, Mindanao)
- `get_regions` - List all regions
- `get_provinces` - List all provinces or provinces in a specific region
- `get_cities` - List all cities or cities in a specific province
- `get_municipalities` - List all municipalities or municipalities in a specific province
- `get_barangays` - List all barangays or barangays in a specific city/municipality
- `get_districts` - List all districts or districts in a specific region

### Search and Discovery

- `search_by_name` - Search for geographic entities by name
- `get_hierarchy` - Get complete hierarchy for a specific PSGC code
- `validate_code` - Validate a PSGC code and get entity details

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
