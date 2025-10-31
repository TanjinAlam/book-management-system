import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AllExceptionsFilter } from '../src/common/filters/custom-exception.filter';
import { AppModule } from './../src/app.module';

/**
 * Generates a unique ISBN-13 number
 * Format: 978-X-XX-XXXXXX-X
 */
function generateUniqueISBN(): string {
  const prefix = '978';
  const registrationGroup = Math.floor(Math.random() * 10);
  const registrant = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');
  const publication = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  // Calculate check digit using ISBN-13 algorithm
  const digits = `${prefix}${registrationGroup}${registrant}${publication}`;
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }

  const checkDigit = (10 - (sum % 10)) % 10;

  return `${prefix}-${registrationGroup}-${registrant}-${publication}-${checkDigit}`;
}

describe('BookController (e2e)', () => {
  let app: INestApplication<App>;
  let testAuthorId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false, // Allow extra query parameters like page/limit
        transform: true,
      }),
    );

    // Apply the same global exception filter as in main.ts
    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

    await app.init();

    // Create a test author to use in book tests
    const authorResponse = await request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'Test',
        lastName: 'Author',
        bio: 'A test author for e2e tests',
        birthDate: '1980-01-01',
      })
      .expect(201);

    expect(authorResponse.body.success).toBe(true);
    expect(authorResponse.body.data).toHaveProperty('id');
    testAuthorId = authorResponse.body.data.id;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/books (POST)', () => {
    it('should create a new book successfully', async () => {
      const createBookDto = {
        title: 'The Great Novel',
        isbn: generateUniqueISBN(),
        publishedDate: '2024-01-15',
        genre: 'Fantasy',
        authorId: testAuthorId,
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.statusCode).toBe(201);
      expect(response.body.message).toBe('Success');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(createBookDto.title);
      expect(response.body.data.isbn).toBe(createBookDto.isbn);
      expect(response.body.data.publishedDate).toBe(
        createBookDto.publishedDate,
      );
      expect(response.body.data.genre).toBe(createBookDto.genre);
      expect(response.body.data.authorId).toBe(createBookDto.authorId);
      expect(response.body.data.author).toBeDefined();
      expect(response.body.data.author.id).toBe(testAuthorId);
    });

    it('should fail when required fields are missing', async () => {
      const invalidBookDto = {
        title: 'Incomplete Book',
        // Missing isbn and authorId
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .send(invalidBookDto)
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should fail when ISBN format is invalid', async () => {
      const invalidBookDto = {
        title: 'Invalid ISBN Book',
        isbn: 'invalid-isbn',
        authorId: testAuthorId,
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .send(invalidBookDto)
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should create book with minimal required fields', async () => {
      const minimalBookDto = {
        title: 'Minimal Book',
        isbn: generateUniqueISBN(),
        authorId: testAuthorId,
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .send(minimalBookDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(minimalBookDto.title);
      expect(response.body.data.isbn).toBe(minimalBookDto.isbn);
      expect(response.body.data.authorId).toBe(minimalBookDto.authorId);
    });

    it('should fail when authorId does not exist', async () => {
      const invalidBookDto = {
        title: 'Book with Invalid Author',
        isbn: generateUniqueISBN(),
        authorId: 999999,
      };

      await request(app.getHttpServer())
        .post('/books')
        .send(invalidBookDto)
        .expect(404);
    });
  });

  describe('/books (GET)', () => {
    it('should return paginated list of books', async () => {
      // First create a book to ensure there's at least one
      const createBookDto = {
        title: 'Test Book for Pagination',
        isbn: generateUniqueISBN(),
        genre: 'Test Genre',
        authorId: testAuthorId,
      };

      await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/books')
        .query({ page: 0, limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('item');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('page');
      expect(response.body.data).toHaveProperty('limit');
      expect(response.body.data).toHaveProperty('hasNextPage');
      expect(Array.isArray(response.body.data.item)).toBe(true);
      expect(response.body.data.item.length).toBeGreaterThan(0);

      // Check that each book has the expected structure
      response.body.data.item.forEach(
        (book: { id: number; title: string; author: unknown }) => {
          expect(book).toHaveProperty('id');
          expect(book).toHaveProperty('title');
          expect(book.author).toBeDefined();
        },
      );
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/books')
        .query({ page: 0, limit: 2 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.page).toBe(0);
      expect(response.body.data.limit).toBe(2);
      expect(response.body.data.item.length).toBeLessThanOrEqual(2);
    });
  });

  describe('/books/:id (GET)', () => {
    it('should return a single book by id', async () => {
      // First create a book
      const createBookDto = {
        title: 'Test Book for Get',
        isbn: generateUniqueISBN(),
        publishedDate: '2024-01-15',
        genre: 'Fantasy',
        authorId: testAuthorId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      const bookId = createResponse.body.data.id;

      // Then retrieve it
      const response = await request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data.id).toBe(bookId);
      expect(response.body.data.title).toBe(createBookDto.title);
      expect(response.body.data.author).toBeDefined();
      expect(response.body.data.author.firstName).toBe('Test');
      expect(response.body.data.author.lastName).toBe('Author');
    });

    it('should return 404 for non-existent book', async () => {
      await request(app.getHttpServer()).get('/books/999999').expect(404);
    });

    it('should return 400 for invalid id format', async () => {
      await request(app.getHttpServer()).get('/books/invalid-id').expect(400);
    });
  });

  describe('/books/:id (PATCH)', () => {
    it('should update a book successfully', async () => {
      // First create a book
      const createBookDto = {
        title: 'Original Title',
        isbn: generateUniqueISBN(),
        authorId: testAuthorId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      const bookId = createResponse.body.data.id;

      // Then update it
      const updateBookDto = {
        title: 'Updated Title',
        genre: 'Science Fiction',
      };

      const response = await request(app.getHttpServer())
        .patch(`/books/${bookId}`)
        .send(updateBookDto)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateBookDto.title);
      expect(response.body.data.genre).toBe(updateBookDto.genre);
      expect(response.body.data.isbn).toBe(createBookDto.isbn);
    });

    it('should return 404 when updating non-existent book', async () => {
      const updateBookDto = {
        title: 'Updated Title',
      };

      await request(app.getHttpServer())
        .patch('/books/999999')
        .send(updateBookDto)
        .expect(404);
    });

    it('should fail when updating with invalid ISBN format', async () => {
      // First create a book
      const createBookDto = {
        title: 'Book to Update',
        isbn: generateUniqueISBN(),
        authorId: testAuthorId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      const bookId = createResponse.body.data.id;

      // Try to update with invalid ISBN
      const updateBookDto = {
        isbn: 'invalid-isbn-format',
      };

      await request(app.getHttpServer())
        .patch(`/books/${bookId}`)
        .send(updateBookDto)
        .expect(400);
    });
  });

  describe('/books/:id (DELETE)', () => {
    it('should delete a book successfully', async () => {
      // First create a book
      const createBookDto = {
        title: 'Book to Delete',
        isbn: generateUniqueISBN(),
        authorId: testAuthorId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      const bookId = createResponse.body.data.id;

      // Then delete it
      await request(app.getHttpServer()).delete(`/books/${bookId}`).expect(204);

      // Verify it's deleted
      await request(app.getHttpServer()).get(`/books/${bookId}`).expect(404);
    });

    it('should return 404 when deleting non-existent book', async () => {
      await request(app.getHttpServer()).delete('/books/999999').expect(404);
    });

    it('should return 400 for invalid id format', async () => {
      await request(app.getHttpServer())
        .delete('/books/invalid-id')
        .expect(400);
    });
  });
});
// Delete author will also delete subsequently created books due to cascade

describe('Author Deletion Cascade (e2e)', () => {
  let app: INestApplication<App>;
  let testAuthorId: number;
  let testBookId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false, // Allow extra query parameters like page/limit
        transform: true,
      }),
    );

    // Apply the same global exception filter as in main.ts
    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

    await app.init();

    // Create a test author
    const authorResponse = await request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'Cascade',
        lastName: 'Test Author',
        bio: 'Author for cascade deletion test',
        birthDate: '1985-05-15',
      })
      .expect(201);

    testAuthorId = authorResponse.body.data.id;

    // Create a book for this author
    const bookResponse = await request(app.getHttpServer())
      .post('/books')
      .send({
        title: 'Cascade Test Book',
        isbn: generateUniqueISBN(),
        genre: 'Test Genre',
        authorId: testAuthorId,
      })
      .expect(201);

    testBookId = bookResponse.body.data.id;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should create author for cascade test', async () => {
    const response = await request(app.getHttpServer())
      .get(`/authors/${testAuthorId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.firstName).toBe('Cascade');
    expect(response.body.data.lastName).toBe('Test Author');
  });

  it('should create book for cascade test', async () => {
    const response = await request(app.getHttpServer())
      .get(`/books/${testBookId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Cascade Test Book');
    expect(response.body.data.authorId).toBe(testAuthorId);
  });

  it('should verify that both author and book exist before deletion', async () => {
    // Verify author exists
    const authorResponse = await request(app.getHttpServer())
      .get(`/authors/${testAuthorId}`)
      .expect(200);
    expect(authorResponse.body.success).toBe(true);

    // Verify book exists
    const bookResponse = await request(app.getHttpServer())
      .get(`/books/${testBookId}`)
      .expect(200);
    expect(bookResponse.body.success).toBe(true);
  });

  it('should delete the author', async () => {
    await request(app.getHttpServer())
      .delete(`/authors/${testAuthorId}`)
      .expect(204);
  });

  it('should verify that both author and book are deleted (cascade effect)', async () => {
    // Verify author is deleted
    await request(app.getHttpServer())
      .get(`/authors/${testAuthorId}`)
      .expect(404);

    // Verify book is deleted (cascade effect)
    await request(app.getHttpServer()).get(`/books/${testBookId}`).expect(404);
  });
});
