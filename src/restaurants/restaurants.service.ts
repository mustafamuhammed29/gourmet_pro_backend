import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { User } from '../users/user.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  // --- ✨ تم تحديث الدالة لتقبل كائناً كاملاً من بيانات المطعم ---
  async create(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    const newRestaurant = this.restaurantsRepository.create(restaurantData);
    return this.restaurantsRepository.save(newRestaurant);
  }
}

