import { Router } from 'express';
import { 
  listNotifications, 
  getNotificationById, 
  createNotification, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, listNotifications);
router.get('/:id', authenticate, getNotificationById);
router.post('/', authenticate, createNotification);
router.patch('/:id/read', authenticate, markAsRead);
router.post('/mark-all-read', authenticate, markAllAsRead);
router.delete('/:id', authenticate, deleteNotification);

export default router;
