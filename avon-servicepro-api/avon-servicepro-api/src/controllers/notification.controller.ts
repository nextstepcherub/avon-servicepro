import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { asyncHandler } from '../utils/asyncHandler';

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, search, userId, status, type } = req.query;
  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    search: search as string,
    filters: { userId, status, type },
  };
  
  const result = await notificationService.listNotifications(options);
  res.status(200).json({
    status: 'success',
    results: result.data.length,
    total: result.total,
    data: { notifications: result.data },
  });
});

export const getNotificationById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await notificationService.getNotificationById(id);
  res.status(200).json({
    status: 'success',
    data: { notification: result },
  });
});

export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  const { userId, title, message, type, priority, link } = req.body;
  const result = await notificationService.createNotification({
    userId,
    title,
    message,
    type,
    priority,
    link
  });
  res.status(201).json({
    status: 'success',
    data: { notification: result },
  });
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await notificationService.markAsRead(id);
  res.status(200).json({
    status: 'success',
    data: { notification: result },
  });
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  await notificationService.markAllAsRead(userId);
  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read',
  });
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await notificationService.deleteNotification(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
