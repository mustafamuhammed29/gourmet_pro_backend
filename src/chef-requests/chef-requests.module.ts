import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChefRequestsController } from './chef-requests.controller';
import { ChefRequestsService } from './chef-requests.service';
import { ChefRequest } from './chef-request.entity';
import { Restaurant } from '../restaurants/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChefRequest, Restaurant])],
  controllers: [ChefRequestsController],
  providers: [ChefRequestsService],
})
export class ChefRequestsModule {}
