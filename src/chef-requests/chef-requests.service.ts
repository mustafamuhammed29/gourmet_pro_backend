import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChefRequest } from './chef-request.entity';
import { CreateChefRequestDto } from './dto/create-chef-request.dto';
import { Restaurant } from '../restaurants/restaurant.entity';

@Injectable()
export class ChefRequestsService {
  constructor(
    @InjectRepository(ChefRequest)
    private chefRequestRepository: Repository<ChefRequest>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(
    createChefRequestDto: CreateChefRequestDto,
    userId: number,
  ): Promise<ChefRequest> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { owner: { id: userId } },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found for the current user.');
    }

    const newRequest = this.chefRequestRepository.create({
      ...createChefRequestDto,
      restaurant: restaurant,
    });

    return this.chefRequestRepository.save(newRequest);
  }

  async findAllByRestaurant(userId: number): Promise<ChefRequest[]> {
    return this.chefRequestRepository.find({
      where: {
        restaurant: {
          owner: {
            id: userId,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    requestId: number,
    status: string,
    userId: number,
  ): Promise<ChefRequest> {
    const request = await this.chefRequestRepository.findOne({
      where: { id: requestId },
      relations: ['restaurant', 'restaurant.owner'],
    });

    if (!request) {
      throw new NotFoundException(`Chef request with ID ${requestId} not found`);
    }

    if (request.restaurant.owner.id !== userId) {
      throw new NotFoundException('Unauthorized');
    }

    request.status = status;
    return this.chefRequestRepository.save(request);
  }
}
