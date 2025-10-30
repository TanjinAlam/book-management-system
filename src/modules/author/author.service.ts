import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import {
  Pagination,
  getPaginateData,
} from '../../common/decorators/pagination.decorator';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FilterAuthorDto } from './dto/filter-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = this.authorRepository.create(createAuthorDto);
    return await this.authorRepository.save(author);
  }

  async findAll(pagination: Pagination, query: FilterAuthorDto) {
    const where: Record<string, unknown>[] = [];
    if (query.firstName) {
      where.push({ firstName: ILike(`%${query.firstName}%`) });
    }
    if (query.lastName) {
      where.push({ lastName: ILike(`%${query.lastName}%`) });
    }

    const [item, total] = await this.authorRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      skip: pagination.offset,
      take: pagination.limit,
      order: { createdAt: 'DESC' },
    });

    return getPaginateData(item, total, pagination);
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);

    const mergedAuthor = this.authorRepository.merge(author, updateAuthorDto);
    return await this.authorRepository.save(mergedAuthor);
  }

  async remove(id: number): Promise<void> {
    const author = await this.findOne(id);
    await this.authorRepository.softRemove(author);
  }
}
