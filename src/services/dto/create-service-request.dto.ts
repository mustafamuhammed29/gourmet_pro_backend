import { IsString, IsOptional } from 'class-validator';

export class CreateServiceRequestDto {
  @IsString()
  serviceName: string;

  @IsOptional()
  @IsString()
  description?: string;
}
