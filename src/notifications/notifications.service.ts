import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './notification.entity';
import { User } from '../users/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    userId: number,
    title: string,
    message: string,
    type: NotificationType = NotificationType.SYSTEM,
    actionUrl?: string,
    imageUrl?: string,
  ): Promise<Notification> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const notification = this.notificationsRepository.create({
      title,
      message,
      type,
      actionUrl,
      imageUrl,
      user,
    });

    return this.notificationsRepository.save(notification);
  }

  async findAllForUser(
    userId: number,
    page: number = 1,
    limit: number = 20,
    status?: NotificationStatus,
  ): Promise<{
    data: Notification[];
    total: number;
    unreadCount: number;
  }> {
    const queryBuilder = this.notificationsRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('notification.status = :status', { status });
    }

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    // Get unread count
    const unreadCount = await this.notificationsRepository.count({
      where: {
        user: { id: userId },
        status: NotificationStatus.UNREAD,
      },
    });

    return { data, total, unreadCount };
  }

  async markAsRead(id: number, userId: number): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.status = NotificationStatus.READ;
    notification.readAt = new Date();

    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationsRepository.update(
      { user: { id: userId }, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ, readAt: new Date() },
    );
  }

  async delete(id: number, userId: number): Promise<void> {
    const result = await this.notificationsRepository.delete({
      id,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new Error('Notification not found');
    }
  }

  // Helper methods for creating specific types of notifications
  async createWelcomeNotification(userId: number): Promise<Notification> {
    return this.create(
      userId,
      'مرحباً بك في Gourmet Pro!',
      'نحن سعداء لانضمامك إلينا. ابدأ بإضافة أطباقك الأولى وإدارة مطعمك بسهولة.',
      NotificationType.SYSTEM,
      '/products',
    );
  }

  async createProductAddedNotification(userId: number, productName: string): Promise<Notification> {
    return this.create(
      userId,
      'تم إضافة طبق جديد',
      `تم إضافة "${productName}" إلى قائمة طعامك بنجاح.`,
      NotificationType.SYSTEM,
      '/products',
    );
  }

  async createSystemMaintenanceNotification(userId: number): Promise<Notification> {
    return this.create(
      userId,
      'صيانة مجدولة',
      'سيتم إجراء صيانة للنظام غداً من الساعة 2:00 إلى 4:00 صباحاً.',
      NotificationType.SYSTEM,
    );
  }
}
