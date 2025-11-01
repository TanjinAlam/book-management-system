# Book Management System

A comprehensive NestJS-based book management system with TypeORM, PostgreSQL, and full CRUD operations for authors and books.

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeORM** - TypeScript ORM for database operations
- **PostgreSQL** - Primary database
- **class-validator** - Input validation
- **class-transformer** - Object transformation
- **Jest** - Testing framework
- **Supertest** - HTTP endpoint testing

## Why PostgreSQL?

PostgreSQL was chosen as the primary database for this project because it perfectly combines reliability, flexibility, and strong typing — making it an excellent match for our TypeScript and NestJS stack.

### Open-Source and Community Support

- **Vibrant ecosystem**: PostgreSQL has a massive open-source community that continuously develops tools, extensions, and documentation.
- **NestJS + TypeORM synergy**: Countless open-source tutorials, libraries, and example projects exist, making troubleshooting and scaling easier.
- **Long-term reliability**: Enterprise-grade support and extensive documentation ensure your project can grow without hitting dead ends.

### 1. Strong Typing and Schema Alignment

PostgreSQL's powerful type system works seamlessly with TypeScript and NestJS.

- **Rich data types**: JSON/JSONB, arrays, UUIDs, enums, and more map directly to TypeScript interfaces.
- **Type safety**: Strict type enforcement prevents data corruption and ensures our database stays in sync with application models.
- **Schema validation**: PostgreSQL's schema rules complement NestJS and TypeScript's compile-time checks for reliable, predictable data.

### 2. Data Integrity & ACID Compliance

- **Transactional consistency**: Full ACID compliance guarantees data consistency, especially for complex relationships like books and authors.
- **Referential integrity**: Foreign keys ensure relationships remain valid.

### 3. Advanced & Flexible Features

PostgreSQL offers a wide range of modern database features:

- **JSON/JSONB support**: Store complex metadata efficiently.
- **Full-text search**: Built-in search for titles, authors, and metadata.
- **Indexing & concurrency**: Multiple indexing strategies and excellent handling of simultaneous read/write operations.
- **Extensible ecosystem**: Supports extensions for geolocation (PostGIS), time-series data (TimescaleDB), and vector/AI search (pgvector) — ready for advanced future features.

### 4. Perfect Fit with NestJS and TypeORM

- **Seamless integration**: NestJS with TypeORM works naturally with PostgreSQL, letting you define entities via decorators in a type-safe way.
- **Safe migrations**: TypeORM migrations keep your schema evolution smooth and reliable.
- **Type-safe queries**: Query builders leverage PostgreSQL's advanced SQL features without sacrificing type safety.
- **Developer productivity**: This combination accelerates development while reducing runtime errors.

### 5. Production-Ready and Scalable

- **Performance**: Optimized for heavy workloads and complex queries.
- **Scalability**: Supports vertical scaling (bigger servers) and horizontal scaling (replication, sharding).
- **Reliability**: Battle-tested in production environments for decades.

### 6. Smooth Developer Experience

- **Cross-platform consistency**: Works the same across Linux, macOS, and Windows.
- **Docker-ready**: Easy to containerize for development or deployment.
- **Rich tooling**: A vast ecosystem of extensions and developer tools boosts productivity.

This combination of strong typing, reliability, and feature richness makes PostgreSQL an ideal choice for a book management system that requires data integrity, performance, and maintainability.

## Features

- **Authors Management**: Create, read, update, delete authors
- **Books Management**: Create, read, update, delete books with author relationships
- **Pagination**: Custom pagination with configurable page size
- **Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Custom exception filters with consistent error responses
- **Soft Delete**: Books and authors support soft deletion
- **Cascade Deletion**: Deleting an author automatically deletes all their books
- **Testing**: Complete unit and e2e test coverage

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **yarn** (package manager)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd book-management-system
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

## Environment Setup

### 1. Copy Environment Files

```bash
# For development
cp .env.example .env

# For testing (recommended to use a separate database)
cp .env.example .env.test
```

### 2. Configure Environment Variables

#### .env (Development)

```bash
NODE_ENV=development
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
POSTGRES_DB=book_management_system
```

#### .env.test (Testing)

```bash
NODE_ENV=test
PORT=3001
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
POSTGRES_DB=book_management_system_test
```

## Database Setup

### 1. Create PostgreSQL Databases

```sql
-- Create development database
CREATE DATABASE book_management_system;

-- Create test database (recommended separate database for testing)
CREATE DATABASE book_management_system_test;
```

### 2. Update Database Credentials

Make sure your PostgreSQL user has the necessary permissions to create/drop tables and perform CRUD operations.

## Running the Application

### Development Mode

```bash
yarn start:dev
```

The application will start on `http://localhost:3000`

### Production Mode

```bash
yarn build
yarn start:prod
```

### Debug Mode

```bash
yarn start:debug
```

## Testing

### Unit Tests

Run all unit tests:

```bash
yarn test
```

Run specific unit test file:

```bash
yarn test -- author.service.spec.ts
```

Run tests with coverage:

```bash
yarn test:cov
```

Run tests in watch mode:

```bash
yarn test:watch
```

### End-to-End Tests

Run all e2e tests:

```bash
yarn test:e2e
```

Run specific e2e test:

```bash
yarn test:e2e -- --testNamePattern="should delete author and cascade delete associated books"
```

Run e2e tests with specific pattern:

```bash
yarn test:e2e -- --testNamePattern="Author Deletion Cascade"
```

## API Endpoints

### Authors

- `GET /authors` - Get paginated list of authors
- `GET /authors/:id` - Get single author by ID
- `POST /authors` - Create new author
- `PATCH /authors/:id` - Update author
- `DELETE /authors/:id` - Delete author (cascades to books)

### Books

- `GET /books` - Get paginated list of books (with optional filters)
- `GET /books/:id` - Get single book by ID
- `POST /books` - Create new book
- `PATCH /books/:id` - Update book
- `DELETE /books/:id` - Delete book

### Query Parameters

#### Pagination

- `page` (number, optional): Page number (default: 0)
- `limit` (number, optional): Items per page (default: 10, max: 100)

#### Book Filters

- `title` (string, optional): Filter by book title (case-insensitive partial match)
- `isbn` (string, optional): Filter by ISBN
- `authorId` (number, optional): Filter by author ID

## Project Structure

```
src/
├── app.controller.ts          # Main application controller
├── app.module.ts              # Main application module
├── app.service.ts             # Main application service
├── main.ts                    # Application entry point
├── config/
│   └── env.validation.ts      # Environment validation
├── common/
│   ├── decorators/
│   │   └── pagination.decorator.ts  # Custom pagination decorator
│   ├── entity/
│   ├── filters/
│   │   └── custom-exception.filter.ts  # Global exception filter
│   ├── helpers/
│   │   └── utils.helper.ts     # Utility functions
│   ├── pipes/
│   ├── utils/
│   │   └── custome-message.ts  # Custom error messages
│   └── guards/
├── modules/
│   ├── author/
│   │   ├── author.controller.ts
│   │   ├── author.service.ts
│   │   ├── author.module.ts
│   │   ├── dto/
│   │   │   ├── create-author.dto.ts
│   │   │   ├── update-author.dto.ts
│   │   │   └── filter-author.dto.ts
│   │   └── entities/
│   │       └── author.entity.ts
│   └── book/
│       ├── book.controller.ts
│       ├── book.service.ts
│       ├── book.module.ts
│       ├── dto/
│       │   ├── create-book.dto.ts
│       │   ├── update-book.dto.ts
│       │   └── filter-book.dto.ts
│       └── entities/
│           └── book.entity.ts
test/
├── app.e2e-spec.ts           # End-to-end tests
└── jest-e2e.json             # Jest e2e configuration
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Book not found",
  "error": "Book not found",
  "path": "/books/123",
  "method": "GET",
  "timestamp": "2025-10-31T08:00:00.000Z"
}
```

## Development Scripts

- `yarn build` - Build the application
- `yarn format` - Format code with Prettier
- `yarn lint` - Run ESLint
- `yarn test` - Run unit tests
- `yarn test:cov` - Run tests with coverage
- `yarn test:e2e` - Run e2e tests

## License

This project is licensed under the UNLICENSED license.
