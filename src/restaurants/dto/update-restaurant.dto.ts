import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateRestaurantDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    cuisineType?: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    story?: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;
}
