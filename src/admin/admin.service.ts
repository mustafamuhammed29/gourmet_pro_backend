import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // ========== Dashboard ==========
  async getDashboardStats() {
    const [
      totalRestaurants,
      pendingRestaurants,
      approvedRestaurants,
      totalUsers,
      totalOrders,
      totalProducts,
    ] = await Promise.all([
      this.restaurantRepository.count(),
      this.restaurantRepository
        .createQueryBuilder('restaurant')
        .leftJoin('restaurant.owner', 'owner')
        .where('owner.status = :status', { status: 'pending' })
        .getCount(),
      this.restaurantRepository
        .createQueryBuilder('restaurant')
        .leftJoin('restaurant.owner', 'owner')
        .where('owner.status = :status', { status: 'approved' })
        .getCount(),
      this.userRepository.count(),
      this.orderRepository.count(),
      this.productRepository.count(),
    ]);

    return {
      totalRestaurants,
      pendingRestaurants,
      approvedRestaurants,
      totalUsers,
      totalOrders,
      totalProducts,
    };
  }

  // ========== إدارة المطاعم ==========
  async getAllRestaurants(status?: string, page: number = 1, limit: number = 20) {
    const query = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.owner', 'owner')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      query.where('owner.status = :status', { status });
    }

    const [restaurants, total] = await query.getManyAndCount();

    return {
      data: restaurants,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRestaurantDetails(id: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['owner', 'products'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async updateRestaurantStatus(id: number, status: string, reason?: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    restaurant.owner.status = status as any;
    await this.userRepository.save(restaurant.owner);

    return {
      message: `Restaurant status updated to ${status}`,
      restaurant,
    };
  }

  async deleteRestaurant(id: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    await this.restaurantRepository.delete(id);

    return { message: 'Restaurant deleted successfully' };
  }

  // ========== إدارة المستخدمين ==========
  async getAllUsers(role?: string, status?: string, page: number = 1, limit: number = 20) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .skip((page - 1) * limit)
      .take(limit);

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (status) {
      query.andWhere('user.status = :status', { status });
    }

    const [users, total] = await query.getManyAndCount();

    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserDetails(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserStatus(id: number, status: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = status as any;
    await this.userRepository.save(user);

    return { message: 'User status updated successfully', user };
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);

    return { message: 'User deleted successfully' };
  }

  // ========== إدارة الطلبات ==========
  async getAllOrders(status?: string, page: number = 1, limit: number = 20) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      query.where('order.status = :status', { status });
    }

    const [orders, total] = await query.getManyAndCount();

    return {
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderDetails(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // ========== إدارة المنتجات ==========
  async getAllProducts(restaurantId?: number, page: number = 1, limit: number = 20) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.restaurant', 'restaurant')
      .skip((page - 1) * limit)
      .take(limit);

    if (restaurantId) {
      query.where('restaurant.id = :restaurantId', { restaurantId });
    }

    const [products, total] = await query.getManyAndCount();

    return {
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.delete(id);

    return { message: 'Product deleted successfully' };
  }

  // ========== التقارير ==========
  async getRevenueReport(startDate: Date, endDate: Date) {
    // هذا مثال بسيط، يمكن تطويره حسب الحاجة
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.price), 0);

    return {
      startDate,
      endDate,
      totalOrders: orders.length,
      totalRevenue,
    };
  }

  async getPopularDishes(limit: number = 10) {
    // هذا مثال بسيط، يمكن تطويره حسب الحاجة
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.restaurant', 'restaurant')
      .take(limit)
      .getMany();

    return products;
  }

  async getActiveRestaurants(limit: number = 10) {
    const restaurants = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.owner', 'owner')
      .where('owner.status = :status', { status: 'approved' })
      .take(limit)
      .getMany();

    return restaurants;
  }
}
