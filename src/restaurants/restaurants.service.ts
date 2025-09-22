import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectRepository(Restaurant)
        private restaurantsRepository: Repository<Restaurant>,
    ) { }

    // دالة لإنشاء مطعم جديد
    async create(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
        const newRestaurant = this.restaurantsRepository.create(restaurantData);
        return this.restaurantsRepository.save(newRestaurant);
    }
}
