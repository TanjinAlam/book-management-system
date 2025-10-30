import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Pagination,
  getPaginateData,
} from '../../common/decorators/pagination.decorator';
import { AuthorService } from '../author/author.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly authorService: AuthorService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    // Verify author exists
    await this.authorService.findOne(createBookDto.authorId);

    const book = this.bookRepository.create(createBookDto);
    const savedBook = await this.bookRepository.save(book);

    // Return with author information
    return await this.findOne(savedBook.id);
  }

  async findAll(pagination: Pagination, query: FilterBookDto) {
    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author');

    if (query.title) {
      queryBuilder.andWhere('book.title ILIKE :title', {
        title: `%${query.title}%`,
      });
    }

    if (query.isbn) {
      queryBuilder.andWhere('book.isbn ILIKE :isbn', {
        isbn: `%${query.isbn}%`,
      });
    }

    if (query.authorId) {
      queryBuilder.andWhere('book.authorId = :authorId', {
        authorId: query.authorId,
      });
    }

    const [item, total] = await queryBuilder
      .skip(pagination.offset)
      .take(pagination.limit)
      .orderBy('book.createdAt', 'DESC')
      .getManyAndCount();

    return getPaginateData(item, total, pagination);
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    // If authorId is being updated, verify the new author exists
    if (updateBookDto.authorId) {
      await this.authorService.findOne(updateBookDto.authorId);
    }

    const mergedBook = this.bookRepository.merge(book, updateBookDto);

    // Return updated book with author information
    return await this.bookRepository.save(mergedBook);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.softRemove(book);
  }
}
