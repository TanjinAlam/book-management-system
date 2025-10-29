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
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    return await this.authorService.create(createAuthorDto);
  }

  @Get()
  async findAll(
    @PaginationParams() pagination: Pagination,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
  ) {
    return await this.authorService.findAll(pagination, {
      firstName,
      lastName,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.authorService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return await this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.authorService.remove(id);
    return {};
  }
}
