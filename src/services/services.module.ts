import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceRequest } from './service-request.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRequest, User])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
