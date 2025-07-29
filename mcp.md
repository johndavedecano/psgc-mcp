# PSGC MCP Server Implementation Plan

## Overview

This document outlines the complete plan for building a Model Context Protocol (MCP) server that provides tools and resources for accessing the Philippine Standard Geographic Code (PSGC) API.

## API Analysis Summary

- **Base URL**: https://psgc.gitlab.io/api
- **Data Source**: Philippine Statistics Authority (PSA)
- **Data Date**: June 30, 2022
- **Format**: JSON (with HTML fallback)
- **Structure**: Hierarchical geographic data (Island Groups → Regions → Provinces → Cities/Municipalities → Barangays)

## API Parameters Documentation

### Parameter Types and Formats

All API endpoints use path parameters for entity identification. The following parameter types are used across the API:

#### Geographic Code Parameters

| Parameter Name           | Description                     | Format             | Example       | Required |
| ------------------------ | ------------------------------- | ------------------ | ------------- | -------- |
| `islandGroupCode`        | Island group identifier         | String (lowercase) | `"luzon"`     | Yes      |
| `regionCode`             | Region identifier               | String (9 digits)  | `"130000000"` | Yes      |
| `provinceCode`           | Province identifier             | String (9 digits)  | `"012800000"` | Yes      |
| `districtCode`           | District identifier             | String (9 digits)  | `"133900000"` | Yes      |
| `cityCode`               | City identifier                 | String (9 digits)  | `"012805000"` | Yes      |
| `municipalityCode`       | Municipality identifier         | String (9 digits)  | `"012801000"` | Yes      |
| `subMunicipalityCode`    | Sub-municipality identifier     | String (9 digits)  | `"133901000"` | Yes      |
| `cityOrMunicipalityCode` | City or municipality identifier | String (9 digits)  | `"012805000"` | Yes      |
| `barangayCode`           | Barangay identifier             | String (9 digits)  | `"012805001"` | Yes      |

#### Code Format Validation Rules

- **Island Group Codes**: lowercase strings (`luzon`, `visayas`, `mindanao`)
- **Region Codes**: 9-digit numeric strings ending with 6 zeros (`130000000`)
- **Province Codes**: 9-digit numeric strings ending with 6 zeros (`012800000`)
- **District Codes**: 9-digit numeric strings ending with 6 zeros (`133900000`)
- **City/Municipality Codes**: 9-digit numeric strings ending with 3 zeros (`012805000`)
- **Barangay Codes**: 9-digit numeric strings (`012805001`)

### Endpoint Parameter Mapping

#### Island Group Endpoints

| MCP Tool                                 | API Endpoint                                                      | Parameters               |
| ---------------------------------------- | ----------------------------------------------------------------- | ------------------------ |
| `get_island_groups`                      | `GET /island-groups.json`                                         | None                     |
| `get_island_group`                       | `GET /island-groups/{islandGroupCode}.json`                       | `islandGroupCode` (path) |
| `get_island_group_regions`               | `GET /island-groups/{islandGroupCode}/regions.json`               | `islandGroupCode` (path) |
| `get_island_group_provinces`             | `GET /island-groups/{islandGroupCode}/provinces.json`             | `islandGroupCode` (path) |
| `get_island_group_districts`             | `GET /island-groups/{islandGroupCode}/districts.json`             | `islandGroupCode` (path) |
| `get_island_group_cities`                | `GET /island-groups/{islandGroupCode}/cities.json`                | `islandGroupCode` (path) |
| `get_island_group_municipalities`        | `GET /island-groups/{islandGroupCode}/municipalities.json`        | `islandGroupCode` (path) |
| `get_island_group_cities_municipalities` | `GET /island-groups/{islandGroupCode}/cities-municipalities.json` | `islandGroupCode` (path) |
| `get_island_group_sub_municipalities`    | `GET /island-groups/{islandGroupCode}/sub-municipalities.json`    | `islandGroupCode` (path) |
| `get_island_group_barangays`             | `GET /island-groups/{islandGroupCode}/barangays.json`             | `islandGroupCode` (path) |

#### Region Endpoints

| MCP Tool                           | API Endpoint                                           | Parameters          |
| ---------------------------------- | ------------------------------------------------------ | ------------------- |
| `get_regions`                      | `GET /regions.json`                                    | None                |
| `get_region`                       | `GET /regions/{regionCode}.json`                       | `regionCode` (path) |
| `get_region_provinces`             | `GET /regions/{regionCode}/provinces.json`             | `regionCode` (path) |
| `get_region_districts`             | `GET /regions/{regionCode}/districts.json`             | `regionCode` (path) |
| `get_region_cities`                | `GET /regions/{regionCode}/cities.json`                | `regionCode` (path) |
| `get_region_municipalities`        | `GET /regions/{regionCode}/municipalities.json`        | `regionCode` (path) |
| `get_region_cities_municipalities` | `GET /regions/{regionCode}/cities-municipalities.json` | `regionCode` (path) |
| `get_region_sub_municipalities`    | `GET /regions/{regionCode}/sub-municipalities.json`    | `regionCode` (path) |
| `get_region_barangays`             | `GET /regions/{regionCode}/barangays.json`             | `regionCode` (path) |

#### Province Endpoints

| MCP Tool                             | API Endpoint                                               | Parameters            |
| ------------------------------------ | ---------------------------------------------------------- | --------------------- |
| `get_provinces`                      | `GET /provinces.json`                                      | None                  |
| `get_province`                       | `GET /provinces/{provinceCode}.json`                       | `provinceCode` (path) |
| `get_province_cities`                | `GET /provinces/{provinceCode}/cities.json`                | `provinceCode` (path) |
| `get_province_municipalities`        | `GET /provinces/{provinceCode}/municipalities.json`        | `provinceCode` (path) |
| `get_province_cities_municipalities` | `GET /provinces/{provinceCode}/cities-municipalities.json` | `provinceCode` (path) |
| `get_province_sub_municipalities`    | `GET /provinces/{provinceCode}/sub-municipalities.json`    | `provinceCode` (path) |
| `get_province_barangays`             | `GET /provinces/{provinceCode}/barangays.json`             | `provinceCode` (path) |

#### District Endpoints

| MCP Tool                             | API Endpoint                                               | Parameters            |
| ------------------------------------ | ---------------------------------------------------------- | --------------------- |
| `get_districts`                      | `GET /districts.json`                                      | None                  |
| `get_district`                       | `GET /districts/{districtCode}.json`                       | `districtCode` (path) |
| `get_district_cities`                | `GET /districts/{districtCode}/cities.json`                | `districtCode` (path) |
| `get_district_municipalities`        | `GET /districts/{districtCode}/municipalities.json`        | `districtCode` (path) |
| `get_district_cities_municipalities` | `GET /districts/{districtCode}/cities-municipalities.json` | `districtCode` (path) |
| `get_district_sub_municipalities`    | `GET /districts/{districtCode}/sub-municipalities.json`    | `districtCode` (path) |
| `get_district_barangays`             | `GET /districts/{districtCode}/barangays.json`             | `districtCode` (path) |

#### City Endpoints

| MCP Tool             | API Endpoint                            | Parameters        |
| -------------------- | --------------------------------------- | ----------------- |
| `get_cities`         | `GET /cities.json`                      | None              |
| `get_city`           | `GET /cities/{cityCode}.json`           | `cityCode` (path) |
| `get_city_barangays` | `GET /cities/{cityCode}/barangays.json` | `cityCode` (path) |

#### Municipality Endpoints

| MCP Tool                     | API Endpoint                                            | Parameters                |
| ---------------------------- | ------------------------------------------------------- | ------------------------- |
| `get_municipalities`         | `GET /municipalities.json`                              | None                      |
| `get_municipality`           | `GET /municipalities/{municipalityCode}.json`           | `municipalityCode` (path) |
| `get_municipality_barangays` | `GET /municipalities/{municipalityCode}/barangays.json` | `municipalityCode` (path) |

#### Sub-Municipality Endpoints

| MCP Tool                         | API Endpoint                                                   | Parameters                   |
| -------------------------------- | -------------------------------------------------------------- | ---------------------------- |
| `get_sub_municipalities`         | `GET /sub-municipalities.json`                                 | None                         |
| `get_sub_municipality`           | `GET /sub-municipalities/{subMunicipalityCode}.json`           | `subMunicipalityCode` (path) |
| `get_sub_municipality_barangays` | `GET /sub-municipalities/{subMunicipalityCode}/barangays.json` | `subMunicipalityCode` (path) |

#### City/Municipality Combined Endpoints

| MCP Tool                          | API Endpoint                                                         | Parameters                      |
| --------------------------------- | -------------------------------------------------------------------- | ------------------------------- |
| `get_cities_municipalities`       | `GET /cities-municipalities.json`                                    | None                            |
| `get_city_municipality`           | `GET /cities-municipalities/{cityOrMunicipalityCode}.json`           | `cityOrMunicipalityCode` (path) |
| `get_city_municipality_barangays` | `GET /cities-municipalities/{cityOrMunicipalityCode}/barangays.json` | `cityOrMunicipalityCode` (path) |

#### Barangay Endpoints

| MCP Tool        | API Endpoint                         | Parameters            |
| --------------- | ------------------------------------ | --------------------- |
| `get_barangays` | `GET /barangays.json`                | None                  |
| `get_barangay`  | `GET /barangays/{barangayCode}.json` | `barangayCode` (path) |

### Content-Type Handling

The PSGC API provides two content-type options:

1. **JSON Format** (Recommended): Use `.json` suffix for proper `application/json` content-type
2. **HTML Format**: Use standard endpoints for `text/html` content-type (fallback)

### Error Handling

The API returns the following HTTP status codes:

- **200**: Success - Returns requested data as JSON array or object
- **404**: Not Found - Returns empty array `[]` or error message
- **Content-Type Issues**: The API notes that some endpoints return `text/html` instead of `application/json`

## Implementation Tasks

### Phase 1: Project Setup and Structure

- [x] Initialize new Node.js project with TypeScript
- [x] Install required dependencies (@modelcontextprotocol/sdk, zod(^3.25.76), axios)
- [x] Set up project structure with proper TypeScript configuration
- [x] Create environment configuration for API base URL

### Phase 2: Data Models and Types

- [x] Create TypeScript interfaces for all PSGC entities:
  - [x] `IslandGroup` interface
  - [x] `Region` interface
  - [x] `Province` interface
  - [x] `District` interface
  - [x] `Municipality` interface
  - [x] `City` interface
  - [x] `CityMunicipality` interface
  - [x] `SubMunicipality` interface
  - [x] `Barangay` interface
- [x] Create Zod schemas for input validation
- [x] Set up shared types and constants

### Phase 3: API Client Implementation

- [x] Create HTTP client wrapper for PSGC API
- [x] Implement error handling for API failures
- [x] Add response caching mechanism
- [x] Handle content-type negotiation (JSON vs HTML)
- [x] Implement rate limiting and retry logic

### Phase 4: Core MCP Tools Implementation

#### 4.1 Island Group Tools

- [x] `get_island_groups` - List all island groups
- [x] `get_island_group` - Get specific island group by code
- [x] `get_island_group_regions` - Get regions in an island group
- [x] `get_island_group_provinces` - Get provinces in an island group
- [x] `get_island_group_cities` - Get cities in an island group
- [x] `get_island_group_municipalities` - Get municipalities in an island group
- [x] `get_island_group_barangays` - Get barangays in an island group

#### 4.2 Region Tools

- [x] `get_regions` - List all regions
- [x] `get_region` - Get specific region by code
- [x] `get_region_provinces` - Get provinces in a region
- [x] `get_region_cities` - Get cities in a region
- [x] `get_region_municipalities` - Get municipalities in a region
- [x] `get_region_barangays` - Get barangays in a region

#### 4.3 Province Tools

- [x] `get_provinces` - List all provinces
- [x] `get_province` - Get specific province by code
- [x] `get_province_cities` - Get cities in a province
- [x] `get_province_municipalities` - Get municipalities in a province
- [x] `get_province_barangays` - Get barangays in a province

#### 4.4 City Tools

- [x] `get_cities` - List all cities
- [x] `get_city` - Get specific city by code
- [x] `get_city_barangays` - Get barangays in a city

#### 4.5 Municipality Tools

- [x] `get_municipalities` - List all municipalities
- [x] `get_municipality` - Get specific municipality by code
- [x] `get_municipality_barangays` - Get barangays in a municipality

#### 4.6 Barangay Tools

- [x] `get_barangays` - List all barangays
- [x] `get_barangay` - Get specific barangay by code

#### 4.7 District Tools

- [x] `get_districts` - List all districts
- [x] `get_district` - Get specific district by code
- [x] `get_district_cities` - Get cities in a district
- [x] `get_district_municipalities` - Get municipalities in a district

#### 4.8 Search and Discovery Tools

- [x] `search_by_name` - Search entities by name across all levels
- [x] `get_hierarchy` - Get complete hierarchy for a specific code
- [x] `validate_code` - Validate if a geographic code exists

### Phase 5: Advanced Features

- [ ] Implement argument completion for codes
- [ ] Add filtering capabilities (by island group, region, etc.)
- [ ] Implement pagination for large result sets
- [ ] Add caching layer with configurable TTL
- [ ] Implement rate limiting per client

### Phase 6: Resources Implementation

- [ ] Create resources for static data access
- [ ] Implement dynamic resources for parameterized queries
- [ ] Add resource templates for hierarchical data access

### Phase 7: Prompts Implementation

- [ ] Create prompts for common geographic queries
- [ ] Implement guided discovery prompts
- [ ] Add data validation prompts

### Phase 8: Testing and Documentation

- [ ] Write comprehensive unit tests for all tools
- [ ] Create integration tests with actual API
- [ ] Write usage documentation and examples
- [ ] Create client usage examples

### Phase 9: Deployment and Distribution

- [ ] Set up build process for distribution
- [ ] Create Docker container for easy deployment
- [ ] Write deployment documentation
- [ ] Publish to npm registry

## Technical Architecture

### Project Structure

```
psgc-mcp-server/
├── src/
│   ├── index.ts                 # Main server entry point
│   ├── types/
│   │   ├── psgc.types.ts       # PSGC data interfaces
│   │   └── api.types.ts        # API response types
│   ├── services/
│   │   ├── psgc-client.ts      # API client wrapper
│   │   └── cache.service.ts    # Caching service
│   ├── tools/
│   │   ├── island-group.ts     # Island group tools
│   │   ├── region.ts           # Region tools
│   │   ├── province.ts         # Province tools
│   │   ├── city.ts             # City tools
│   │   ├── municipality.ts     # Municipality tools
│   │   ├── barangay.ts         # Barangay tools
│   │   └── district.ts         # District tools
│   ├── resources/
│   │   └── psgc-resources.ts   # MCP resources
│   ├── prompts/
│   │   └── psgc-prompts.ts     # MCP prompts
│   └── utils/
│       ├── validation.ts       # Input validation
│       └── formatting.ts       # Response formatting
├── tests/
├── docs/
├── package.json
├── tsconfig.json
└── README.md
```

### API Endpoints Mapping

| MCP Tool             | API Endpoint                      | Parameters                                     | Description               |
| -------------------- | --------------------------------- | ---------------------------------------------- | ------------------------- |
| `get_island_groups`  | `GET /island-groups.json`         | None                                           | List all island groups    |
| `get_island_group`   | `GET /island-groups/{code}.json`  | `islandGroupCode`: string (e.g., "luzon")      | Get specific island group |
| `get_regions`        | `GET /regions.json`               | None                                           | List all regions          |
| `get_region`         | `GET /regions/{code}.json`        | `regionCode`: string (e.g., "130000000")       | Get specific region       |
| `get_provinces`      | `GET /provinces.json`             | None                                           | List all provinces        |
| `get_province`       | `GET /provinces/{code}.json`      | `provinceCode`: string (e.g., "012800000")     | Get specific province     |
| `get_cities`         | `GET /cities.json`                | None                                           | List all cities           |
| `get_city`           | `GET /cities/{code}.json`         | `cityCode`: string (e.g., "012805000")         | Get specific city         |
| `get_municipalities` | `GET /municipalities.json`        | None                                           | List all municipalities   |
| `get_municipality`   | `GET /municipalities/{code}.json` | `municipalityCode`: string (e.g., "012801000") | Get specific municipality |
| `get_barangays`      | `GET /barangays.json`             | None                                           | List all barangays        |
| `get_barangay`       | `GET /barangays/{code}.json`      | `barangayCode`: string (e.g., "012805001")     | Get specific barangay     |
| `get_districts`      | `GET /districts.json`             | None                                           | List all districts        |
| `get_district`       | `GET /districts/{code}.json`      | `districtCode`: string (e.g., "133900000")     | Get specific district     |

### Usage Examples

#### Basic Usage

```typescript
// Get all regions
const regions = await client.callTool({
  name: 'get_regions',
});

// Get provinces in a specific region
const provinces = await client.callTool({
  name: 'get_region_provinces',
  arguments: { regionCode: '130000000' },
});

// Search for a city by name
const cities = await client.callTool({
  name: 'search_by_name',
  arguments: { name: 'Cebu', type: 'city' },
});
```

#### Advanced Usage

```typescript
// Get complete hierarchy for a barangay
const hierarchy = await client.callTool({
  name: 'get_hierarchy',
  arguments: { code: '012805001' },
});

// Validate a geographic code
const isValid = await client.callTool({
  name: 'validate_code',
  arguments: { code: '130000000' },
});
```
