import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from '../author/author.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
