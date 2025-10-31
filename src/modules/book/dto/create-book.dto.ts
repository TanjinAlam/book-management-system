import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsISBN,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  @MaxLength(255, { message: 'title must not exceed 255 characters' })
  title: string;

  // support isbn-13 format
  @IsISBN(13, {
    message: 'isbn must be a valid ISBN format (e.g., 978-3-16-148410-0)',
  })
  @IsNotEmpty({ message: 'isbn is required' })
  isbn: string;

  @IsDateString(
    {},
    {
      message:
        'publishedDate must be a valid ISO 8601 date string (YYYY-MM-DD)',
    },
  )
  @IsOptional()
  publishedDate?: string;

  @IsOptional()
  @MaxLength(100, { message: 'genre must not exceed 100 characters' })
  @IsString({ message: 'genre must be a string' })
  genre?: string;

  @IsPositive({ message: 'authorId must be a positive number' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty({ message: 'authorId is required' })
  authorId: number;
}
