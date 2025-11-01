import { IsString, IsOptional } from 'class-validator';

export class CreateChefRequestDto {
  @IsString()
  dishName: string;

  @IsOptional()
  @IsString()
  description?: string;
}
