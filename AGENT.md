# AGENT.md - PSGC MCP Development Guide

## Build/Lint/Test Commands
- `npm run build` - Build the TypeScript project
- `npm run dev` - Run in development mode (tsx)
- `npm test` - Run all tests with vitest  
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with UI
- `npx vitest run <file>` - Run a single test file
- `npm run lint` - ESLint check
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

## Project Structure
- Model Context Protocol (MCP) server for Philippine Standard Geographic Code (PSGC) API
- **src/index.ts** - Main MCP server entry point
- **src/tools/** - MCP tool registrations by geographic level (island-group, region, province, etc.)
- **src/services/** - PSGC API client and service layer
- **src/types/** - TypeScript types and Zod validation schemas
- **tests/** - Unit and integration tests organized by type

## Code Style & Conventions
- **TypeScript + ES modules** - Strict typing required
- **Zod validation schemas** - All API parameters validated with Zod
- **Error handling** - Try/catch with structured error responses
- **Imports** - Use .js extensions for local imports, organize by external/local
- **Naming** - camelCase for variables/functions, PascalCase for types/schemas
- **Comments** - JSDoc for exported functions, minimal inline comments
- **MCP patterns** - Tools return {content: [{type: 'text', text: JSON.stringify(...)}]} format
