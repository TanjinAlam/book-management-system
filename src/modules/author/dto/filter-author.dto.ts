import { IsOptional, IsString } from 'class-validator';

export class FilterAuthorDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
