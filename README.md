# NestJS Template

The repository provides examples of the main toolkit used to write a basic service on the NestJS framework.

## Requirements
- NodeJS v16.15.0 (minimum version for compatibility with NestJS and dependencies)
- PostgreSQL 12 (required for database features like UUID extensions)
- Package manager: pnpm (recommended), npm/yarn compatible

## Database Setup
Before running the project, ensure PostgreSQL is set up with the `uuid-ossp` extension for UUID generation:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Project Structure
- `test/`                  - End-to-end (e2e) tests
- `src/`                   - Source code
  - `main.ts`              - Application entry point
  - `app/`                 - Core application modules
    - `app.module.ts`      - Root module for NestJS application
      - `auth/guards/`       - Authentication guards for securing routes
    - `files/`               - Module for file-related functionality
    - `storage/`             - Module for storage operations
  - `common/`              - Shared utilities and modules
    - `query-manager/filters/` - Tools for query filtering and management
    - `utils/`             - General-purpose utility functions
  - `libs/`                - Reusable libraries across projects
    - `database/`            - Database configuration
      - `database.module.ts` - Module for PostgreSQL connection setup
    - `node-fetch/`        - HTTP request utility
    - `logger/`            - Custom logging module

## File Naming Convention
- Format: `{name}.{resource_type}.ts`
  - `{name}`: Resource name (e.g., `user`, `file`)
  - `{resource_type}`: Type of file (e.g., `controller`, `service`)
- Unit tests: `{name}.{resource_type}.test.ts`
- Examples:
  - `user.controller.ts`
  - `file.service.test.ts`

## Default Module Structure
Each module follows a standardized structure for consistency:
- `dto/`                   - Data Transfer Objects
  - `{name}-create.dto.ts` - DTO for creating a resource
  - `{name}-response.dto.ts` - DTO for response formatting
  - `{name}-update.dto.ts` - DTO for updating a resource
  - `{name}.dto.ts`        - Base DTO (if applicable)
- `interfaces/`            - TypeScript interfaces
  - `{name}-create.interface.ts` - Interface for creation data
  - `{name}-response.interface.ts` - Interface for response data
  - `{name}-update.interface.ts` - Interface for update data
  - `{name}.interface.ts`  - Base interface
- `{name}.controller.ts`   - HTTP request handlers
- `{name}.controller.test.ts` - Unit tests for controller
- `{name}.generator.ts`    - Mock data generator for testing
- `{name}.module.ts`       - NestJS module definition
- `{name}.service.ts`      - Business logic
- `{name}.service.test.ts` - Unit tests for service

## Naming Conventions
- Filenames: `kebab-case` (e.g., `user-service.ts`)
- Classes: `PascalCase` (e.g., `UserService`)
- Variables: `camelCase` (e.g., `userId`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- Interfaces/Types: Start with `I` (e.g., `IUser`)
- DTOs: End with `DTO` (e.g., `UserResponseDTO`)

## Starting the Service
1. Copy `.env.example` to `.env` and configure environment variables.
2. Install dependencies:

```
pnpm install
```
3. Build the project:

```
pnpm build
```
4. Apply database migrations:

```
npx prisma migrate deploy
```
*Note*: Ensure your PostgreSQL server is running and `.env` is correctly configured.

5. Run tests:
```
pnpm tests
```
6. Start the server:
```
pnpm run run
```
7. Access Swagger UI at: `http://localhost:3060/api/swagger`

## API Responses
### Success Response (HTTP 200)
```json
{}
```

### Default error response:

```json
{
  "message": "Cannot POST /api/auth/native/sign-up/check",
  "error": "Not Found",
  "statusCode": 404
}
```

### Default pagination

`GET - /api/files?offset=10&limit=10`

Default response with server pagination:

```json
{
  "count": 10,
  "rows": []
}
```
