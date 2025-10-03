import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratePostDto {
    @IsString()
    @IsNotEmpty()
    dishName: string;

    @IsString()
    @IsNotEmpty()
    dishDescription: string;
}
