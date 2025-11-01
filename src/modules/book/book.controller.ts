import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type {
  PaginatedResponse,
  Pagination,
} from '../../common/decorators/pagination.decorator';
import { PaginationParams } from '../../common/decorators/pagination.decorator';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { CustomParseIntPipe } from '../../common/pipes/custom-parse-int.pipe';
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
  async create(
    @Body() createBookDto: CreateBookDto,
  ): Promise<ApiResponse<Book>> {
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Success',
      data: await this.bookService.create(createBookDto),
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @PaginationParams() pagination: Pagination,
    @Query() filterBookDto: FilterBookDto,
  ): Promise<ApiResponse<PaginatedResponse<Book>>> {
    const result = await this.bookService.findAll(pagination, filterBookDto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', CustomParseIntPipe) id: number,
  ): Promise<ApiResponse<Book>> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.bookService.findOne(id),
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<ApiResponse<Book>> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.bookService.update(id, updateBookDto),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', CustomParseIntPipe) id: number): Promise<void> {
    await this.bookService.remove(id);
  }
}
