import { Request, Response, NextFunction } from 'express';

export async function listNotifications(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}

export async function getNotificationById(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: null });
}

export async function createNotification(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Notification marked as read' });
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'All notifications marked as read' });
}

export async function deleteNotification(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Notification deleted' });
}
