import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type {
  PaginatedResponse,
  Pagination,
} from '../../common/decorators/pagination.decorator';
import { PaginationParams } from '../../common/decorators/pagination.decorator';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return await this.bookService.create(createBookDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @PaginationParams() pagination: Pagination,
    @Query() filterBookDto: FilterBookDto,
  ): Promise<PaginatedResponse<Book>> {
    return await this.bookService.findAll(pagination, filterBookDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return await this.bookService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return await this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.bookService.remove(id);
  }
}
