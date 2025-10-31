# Book Management System

A comprehensive NestJS-based book management system with TypeORM, PostgreSQL, and full CRUD operations for authors and books.

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

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeORM** - TypeScript ORM for database operations
- **PostgreSQL** - Primary database
- **class-validator** - Input validation
- **class-transformer** - Object transformation
- **Jest** - Testing framework
- **Supertest** - HTTP endpoint testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `yarn test && yarn test:e2e`
5. Submit a pull request

## License

This project is licensed under the UNLICENSED license.
