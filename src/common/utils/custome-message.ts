export const ERROR_MESSAGES = {
  GENERAL: 'Something went wrong',
  AUTHOR_NOT_FOUND_DELETE: 'Author not found during delete operation',
  BOOK_NOT_FOUND_DELETE: 'Book not found during delete operation',
} as const;

export const SUCCESS_MESSAGES = {
  AUTHOR_CREATED: 'Author created successfully',
  AUHTOR_LIST_RETRIEVED: 'Author list retrieved successfully',
  AUTHOR_RETRIEVED: 'Author retrieved successfully',
  AUTHOR_UPDATED: 'Author updated successfully',
  AUTHOR_DELETED: 'Author deleted successfully',
  BOOK_CREATED: 'Book created successfully',
  BOOK_UPDATED: 'Book updated successfully',
  BOOK_LIST_RETRIEVED: 'Book list retrieved successfully',
  BOOK_RETRIEVED: 'Book retrieved successfully',
  BOOK_DELETED: 'Book deleted successfully',
} as const;
