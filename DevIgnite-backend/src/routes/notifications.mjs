import express from 'express';
import notificationController from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.mjs';

const router = express.Router();

router.get('/preferences', notificationController.getPreferences);


router.put('/preferences', notificationController.updateAllPreferences);


router.patch('/preferences/department', notificationController.updateDepartmentPreference);


router.get('/history', notificationController.getNotificationHistory);


router.get('/unread-count', notificationController.getUnreadCount);


router.patch('/:notificationId/read', notificationController.markAsRead);

router.patch('/read-all', notificationController.markAllAsRead);

router.post('/send', notificationController.triggerNotification);

export default router;