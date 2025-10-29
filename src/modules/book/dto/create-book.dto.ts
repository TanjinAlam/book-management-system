import {
  IsDateString,
  IsISBN,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsISBN(undefined, {
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

  @IsString({ message: 'genre must be a string' })
  @IsOptional()
  genre?: string;

  @IsNumber({}, { message: 'authorId must be a number' })
  @IsNotEmpty({ message: 'authorId is required' })
  authorId: number;
}
