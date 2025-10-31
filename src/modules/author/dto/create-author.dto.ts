import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAuthorDto {
  @MaxLength(255, { message: 'firstName must not exceed 255 characters' })
  @IsString({ message: 'firstName must be a string' })
  @IsNotEmpty({ message: 'firstName is required' })
  firstName: string;

  @MaxLength(255, { message: 'lastName must not exceed 255 characters' })
  @IsString({ message: 'lastName must be a string' })
  @IsNotEmpty({ message: 'lastName is required' })
  lastName: string;

  @IsOptional()
  @MaxLength(1000, { message: 'biography must not exceed 1000 characters' })
  @IsString({ message: 'bio must be a string' })
  bio?: string;

  @IsDateString(
    {},
    { message: 'birthDate must be a valid ISO 8601 date string (YYYY-MM-DD)' },
  )
  @IsOptional()
  birthDate?: string;
}
