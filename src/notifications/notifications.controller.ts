import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationStatus } from './notification.entity';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('my-notifications')
  async getMyNotifications(
    @Req() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status?: NotificationStatus,
  ) {
    return this.notificationsService.findAllForUser(
      req.user.userId,
      parseInt(page, 10),
      parseInt(limit, 10),
      status,
    );
  }

  @Get()
  async findAll(
    @Req() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status?: NotificationStatus,
  ) {
    return this.notificationsService.findAllForUser(
      req.user.userId,
      parseInt(page, 10),
      parseInt(limit, 10),
      status,
    );
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req) {
    return this.notificationsService.markAsRead(
      parseInt(id, 10),
      req.user.userId,
    );
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req) {
    await this.notificationsService.markAllAsRead(req.user.userId);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    await this.notificationsService.delete(
      parseInt(id, 10),
      req.user.userId,
    );
    return { message: 'Notification deleted successfully' };
  }

  // Test endpoint to create sample notifications
  @Post('test/welcome')
  async createTestWelcome(@Req() req) {
    return this.notificationsService.createWelcomeNotification(req.user.userId);
  }

  @Post('test/maintenance')
  async createTestMaintenance(@Req() req) {
    return this.notificationsService.createSystemMaintenanceNotification(req.user.userId);
  }
}
