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
import { SUCCESS_MESSAGES } from '../../common/utils/custome-message';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FilterAuthorDto } from './dto/filter-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  async create(
    @Body() createAuthorDto: CreateAuthorDto,
  ): Promise<ApiResponse<Author>> {
    return {
      success: true,
      message: SUCCESS_MESSAGES.AUTHOR_CREATED,
      statusCode: HttpStatus.CREATED,
      data: await this.authorService.create(createAuthorDto),
    };
  }

  @Get()
  async findAll(
    @PaginationParams() pagination: Pagination,
    @Query() filterAuthorDto: FilterAuthorDto,
  ): Promise<ApiResponse<PaginatedResponse<Author>>> {
    const result = await this.authorService.findAll(
      pagination,
      filterAuthorDto,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: SUCCESS_MESSAGES.AUHTOR_LIST_RETRIEVED,
      data: result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', CustomParseIntPipe) id: number,
  ): Promise<ApiResponse<Author>> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: SUCCESS_MESSAGES.AUTHOR_RETRIEVED,
      data: await this.authorService.findOne(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<ApiResponse<Author>> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: SUCCESS_MESSAGES.AUTHOR_UPDATED,
      data: await this.authorService.update(id, updateAuthorDto),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', CustomParseIntPipe) id: number): Promise<void> {
    await this.authorService.remove(id);
  }
}
