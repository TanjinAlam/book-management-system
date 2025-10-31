import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAuthorDto {
  @IsString({ message: 'firstName must be a string' })
  @IsNotEmpty({ message: 'firstName is required' })
  @MaxLength(255, { message: 'firstName must not exceed 255 characters' })
  firstName: string;

  @IsString({ message: 'lastName must be a string' })
  @IsNotEmpty({ message: 'lastName is required' })
  @MaxLength(255, { message: 'lastName must not exceed 255 characters' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'bio must be a string' })
  @MaxLength(1000, { message: 'biography must not exceed 1000 characters' })
  bio?: string;

  @IsDateString(
    {},
    { message: 'birthDate must be a valid ISO 8601 date string (YYYY-MM-DD)' },
  )
  @IsOptional()
  birthDate?: string;
}
