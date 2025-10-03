import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) { }

  async create(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    const newRestaurant = this.restaurantsRepository.create(restaurantData);
    return this.restaurantsRepository.save(newRestaurant);
  }

  // --- ✨ دالة جديدة لجلب المطعم حسب هوية المالك ---
  async findOneByOwnerId(ownerId: number): Promise<Restaurant> {
    const restaurant = await this.restaurantsRepository.findOne({
      where: { owner: { id: ownerId } },
    });
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant for owner ID ${ownerId} not found.`,
      );
    }
    return restaurant;
  }

  // --- ✨ دالة جديدة لتحديث بيانات المطعم ---
  async update(
    ownerId: number,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.findOneByOwnerId(ownerId);
    // دمج البيانات الجديدة مع البيانات الحالية
    const updatedRestaurant = Object.assign(restaurant, updateRestaurantDto);
    return this.restaurantsRepository.save(updatedRestaurant);
  }
}
