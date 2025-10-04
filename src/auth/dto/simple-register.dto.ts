import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SimpleRegisterDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  restaurantName: string;

  @IsNotEmpty()
  cuisineType: string;

  @IsNotEmpty()
  address: string;
}
