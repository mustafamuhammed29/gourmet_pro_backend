import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  dishName: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  productId?: number;
}
