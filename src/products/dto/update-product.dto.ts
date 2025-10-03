import { IsString, IsNumber, Min, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString({ message: 'اسم الطبق يجب أن يكون نصاً' })
    @IsNotEmpty({ message: 'اسم الطبق لا يمكن أن يكون فارغاً' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'الوصف يجب أن يكون نصاً' })
    @IsNotEmpty({ message: 'الوصف لا يمكن أن يكون فارغاً' })
    description?: string;

    @IsOptional()
    @IsNumber({}, { message: 'السعر يجب أن يكون رقماً' })
    @Min(0, { message: 'السعر لا يمكن أن يكون سالباً' })
    price?: number;

    @IsOptional()
    @IsString({ message: 'الفئة يجب أن تكون نصاً' })
    @IsNotEmpty({ message: 'الفئة لا يمكن أن تكون فارغاً' })
    category?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}
