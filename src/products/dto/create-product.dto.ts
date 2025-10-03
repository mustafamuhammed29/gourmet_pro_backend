import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    IsOptional,
} from 'class-validator';

export class CreateProductDto {
    @IsString({ message: 'اسم الطبق يجب أن يكون نصاً' })
    @IsNotEmpty({ message: 'اسم الطبق مطلوب' })
    name: string;

    @IsString({ message: 'الوصف يجب أن يكون نصاً' })
    @IsNotEmpty({ message: 'وصف الطبق مطلوب' })
    description: string;

    @IsNumber({}, { message: 'السعر يجب أن يكون رقماً' })
    @Min(0, { message: 'السعر لا يمكن أن يكون سالباً' })
    price: number;

    @IsString({ message: 'الفئة يجب أن تكون نصاً' })
    @IsNotEmpty({ message: 'فئة الطبق مطلوبة' })
    category: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}
