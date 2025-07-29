# Coding Style Guidelines for PSGC MCP Server

## TypeScript Configuration

- Use strict mode in tsconfig.json
- Enable all strict type checking options
- Prefer interfaces over type aliases for object shapes
- Always specify return types for functions
- Use explicit types instead of 'any'

## Naming Conventions

- **Interfaces**: PascalCase with descriptive names (e.g., `IslandGroup`, `Region`)
- **Functions**: camelCase with verb-noun pattern (e.g., `getIslandGroups`, `validateCode`)
- **Variables**: camelCase, descriptive and specific (e.g., `regionCode`, `isValid`)
- **Constants**: UPPER_SNAKE_CASE for magic numbers and strings
- **Files**: kebab-case for file names (e.g., `island-group.ts`, `psgc-client.ts`)

## Code Formatting

- Use ESLint with TypeScript configuration
- Use Prettier for consistent formatting
- Use 2 spaces for indentation
- Maximum line length: 100 characters
- Use semicolons consistently
- Single quotes for strings
- Trailing commas in multi-line objects and arrays
- Space after keywords and operators

## Linting Configuration

- Use `@typescript-eslint/recommended` rules
- Enable `eslint-config-prettier` to avoid conflicts
- Include `eslint-plugin-import` for import sorting
- Use `eslint-plugin-vitest` for test-specific rules

## Error Handling

- Use try-catch blocks for all async operations
- Create custom error classes for specific error types
- Provide meaningful error messages
- Log errors with appropriate context
- Implement proper error propagation

## API Design

- Use consistent parameter naming across all tools
- Implement proper input validation with Zod schemas
- Return standardized response formats
- Handle both success and error cases gracefully
- Support pagination for large result sets

## Testing Patterns

- Use descriptive test names that explain the scenario
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies appropriately
- Test both happy path and error scenarios
- Include performance benchmarks for critical paths
