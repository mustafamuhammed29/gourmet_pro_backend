import { IsOptional, IsString } from 'class-validator';

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

    // لاحقاً، يمكن إضافة حقول أخرى مثل bio, story, logoUrl
}
