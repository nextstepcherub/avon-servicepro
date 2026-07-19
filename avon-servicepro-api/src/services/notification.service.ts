import { notificationRepository, NotificationEntity } from '../repositories/notification.repository';
import { logger } from '../config/logger';
import { NotFoundError } from '../utils/apiError';
import { QueryOptions } from '../repositories/base.repository';

export class NotificationService {
  async createNotification(data: Omit<NotificationEntity, 'id' | 'status' | 'createdAt'>): Promise<NotificationEntity> {
    logger.info(`NotificationService: Creating notification for user ${data.userId} - Title: ${data.title}`);
    return await notificationRepository.create({
      ...data,
      status: 'UNREAD',
      createdAt: new Date().toISOString()
    });
  }

  async listNotifications(options?: QueryOptions): Promise<{ data: NotificationEntity[]; total: number }> {
    logger.info(`NotificationService: Listing notifications with options: ${JSON.stringify(options)}`);
    return await notificationRepository.findAll(options);
  }

  async getNotificationById(id: string): Promise<NotificationEntity> {
    logger.info(`NotificationService: Fetching notification details for ID ${id}`);
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError(`Notification with ID '${id}' not found`);
    }
    return notification;
  }

  async markAsRead(id: string): Promise<NotificationEntity> {
    logger.info(`NotificationService: Marking notification ID ${id} as READ`);
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError(`Notification with ID '${id}' not found`);
    }
    return await notificationRepository.update(id, {
      status: 'READ',
      readAt: new Date().toISOString()
    });
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    logger.info(`NotificationService: Marking all notifications as READ for user ID ${userId}`);
    return await notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(id: string): Promise<boolean> {
    logger.info(`NotificationService: Deleting notification ID ${id}`);
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError(`Notification with ID '${id}' not found`);
    }
    return await notificationRepository.delete(id);
  }
}

export const notificationService = new NotificationService();
export default notificationService;
