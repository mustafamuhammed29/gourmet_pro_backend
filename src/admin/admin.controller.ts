import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ========== Dashboard ==========
  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ========== إدارة المطاعم ==========
  @Get('restaurants')
  async getAllRestaurants(
    @Query('status') status?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllRestaurants(
      status,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('restaurants/:id')
  async getRestaurantDetails(@Param('id') id: string) {
    return this.adminService.getRestaurantDetails(parseInt(id, 10));
  }

  @Patch('restaurants/:id/approve')
  async approveRestaurant(@Param('id') id: string) {
    return this.adminService.updateRestaurantStatus(parseInt(id, 10), 'approved');
  }

  @Patch('restaurants/:id/reject')
  async rejectRestaurant(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.updateRestaurantStatus(parseInt(id, 10), 'rejected', reason);
  }

  @Patch('restaurants/:id/suspend')
  async suspendRestaurant(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.updateRestaurantStatus(parseInt(id, 10), 'suspended', reason);
  }

  @Delete('restaurants/:id')
  async deleteRestaurant(@Param('id') id: string) {
    return this.adminService.deleteRestaurant(parseInt(id, 10));
  }

  // ========== إدارة المستخدمين ==========
  @Get('users')
  async getAllUsers(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllUsers(
      role,
      status,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('users/:id')
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(parseInt(id, 10));
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateUserStatus(parseInt(id, 10), status);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(parseInt(id, 10));
  }

  // ========== إدارة الطلبات ==========
  @Get('orders')
  async getAllOrders(
    @Query('status') status?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllOrders(
      status,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('orders/:id')
  async getOrderDetails(@Param('id') id: string) {
    return this.adminService.getOrderDetails(parseInt(id, 10));
  }

  // ========== إدارة المنتجات ==========
  @Get('products')
  async getAllProducts(
    @Query('restaurantId') restaurantId?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllProducts(
      restaurantId ? parseInt(restaurantId, 10) : undefined,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(parseInt(id, 10));
  }

  // ========== التقارير ==========
  @Get('reports/revenue')
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.adminService.getRevenueReport(new Date(startDate), new Date(endDate));
  }

  @Get('reports/popular-dishes')
  async getPopularDishes(@Query('limit') limit: string = '10') {
    return this.adminService.getPopularDishes(parseInt(limit, 10));
  }

  @Get('reports/active-restaurants')
  async getActiveRestaurants(@Query('limit') limit: string = '10') {
    return this.adminService.getActiveRestaurants(parseInt(limit, 10));
  }
}
