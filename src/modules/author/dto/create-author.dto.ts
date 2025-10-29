import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuthorDto {
  @IsString({ message: 'firstName must be a string' })
  @IsNotEmpty({ message: 'firstName is required' })
  firstName: string;

  @IsString({ message: 'lastName must be a string' })
  @IsNotEmpty({ message: 'lastName is required' })
  lastName: string;

  @IsString({ message: 'bio must be a string' })
  @IsOptional()
  bio?: string;

  @IsDateString(
    {},
    { message: 'birthDate must be a valid ISO 8601 date string (YYYY-MM-DD)' },
  )
  @IsOptional()
  birthDate?: string;
}
