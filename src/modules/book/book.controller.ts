import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { Pagination } from '../../common/decorators/pagination.decorator';
import { PaginationParams } from '../../common/decorators/pagination.decorator';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.create(createBookDto);
  }

  @Get()
  async findAll(
    @PaginationParams() pagination: Pagination,
    @Query('title') title?: string,
    @Query('isbn') isbn?: string,
    @Query('authorId', new ParseIntPipe({ optional: true })) authorId?: number,
  ) {
    return await this.bookService.findAll(pagination, {
      title,
      isbn,
      authorId,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.bookService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.bookService.remove(id);
    return {};
  }
}
