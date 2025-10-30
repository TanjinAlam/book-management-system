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
  Pagination,
  PaginatedResponse,
} from '../../common/decorators/pagination.decorator';
import { PaginationParams } from '../../common/decorators/pagination.decorator';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FilterAuthorDto } from './dto/filter-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return await this.authorService.create(createAuthorDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @PaginationParams() pagination: Pagination,
    @Query() filterAuthorDto: FilterAuthorDto,
  ): Promise<PaginatedResponse<Author>> {
    return await this.authorService.findAll(pagination, filterAuthorDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Author> {
    return await this.authorService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return await this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<object> {
    await this.authorService.remove(id);
    return {};
  }
}
