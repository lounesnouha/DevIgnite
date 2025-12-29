import { User } from '../models/User.mjs';
import { Post } from '../models/Post.mjs';
import notificationService from '../services/notificationService.mjs';

class NotificationController {

  async getPreferences(req, res) {
    try {
      const userId = req.user.id; 
      const user = await User.findById(userId).select('notificationPreferences followedDepartments');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const preferences = {};
      user.followedDepartments.forEach(dept => {
        preferences[dept] = user.notificationPreferences?.[dept] ?? true;
      });

      res.json({
        success: true,
        preferences,
        followedDepartments: user.followedDepartments
      });
    } catch (error) {
      console.error('Error fetching preferences:', error);
      res.status(500).json({ error: 'Failed to fetch preferences' });
    }
  }

  async updateDepartmentPreference(req, res) {
    try {
      const userId = req.user.id;
      const { department, enabled } = req.body;

      // Validate department
      const validDepartments = ["DEV", "UIUX", "DESIGN", "HR", "COM", "RELV"];
      if (!validDepartments.includes(department)) {
        return res.status(400).json({ error: 'Invalid department' });
      }

      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.followedDepartments.includes(department)) {
        return res.status(400).json({ 
          error: 'You must follow this department to receive notifications' 
        });
      }

      await user.updateNotificationPreference(department, enabled);

      res.json({
        success: true,
        message: `Notifications ${enabled ? 'enabled' : 'disabled'} for ${department}`,
        preferences: user.notificationPreferences
      });
    } catch (error) {
      console.error('Error updating department preference:', error);
      res.status(500).json({ error: 'Failed to update preference' });
    }
  }

  async updateAllPreferences(req, res) {
    try {
      const userId = req.user.id;
      const { preferences } = req.body;

      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      Object.keys(preferences).forEach(dept => {
        if (user.followedDepartments.includes(dept)) {
          user.notificationPreferences[dept] = preferences[dept];
        }
      });

      await user.save();

      res.json({
        success: true,
        message: 'Notification preferences updated',
        preferences: user.notificationPreferences
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  }

  async sendPostNotifications(postId) {
    try {
      const post = await Post.findById(postId).populate('author', 'username email');
      
      if (!post || post.notificationsSent) {
        console.log('Post not found or notifications already sent');
        return;
      }

      const usersToNotify = await User.find({
        followedDepartments: post.department,
        $or: [
          { [`notificationPreferences.${post.department}`]: true },
          { [`notificationPreferences.${post.department}`]: { $exists: false } }
        ]
      }).select('email username');

      if (usersToNotify.length === 0) {
        console.log(`No users to notify for department: ${post.department}`);
        return { recipientCount: 0 };
      }

      const recipients = usersToNotify.map(user => user.email);

      const deptNames = {
        DEV: 'Development',
        UIUX: 'UI/UX',
        DESIGN: 'Design',
        HR: 'Human Resources',
        COM: 'Communication',
        RELV: 'Relevance'
      };

      await notificationService.sendPostNotification(
        recipients,
        {
          title: post.title,
          content: post.content,
          link: `${process.env.FRONTEND_URL}/posts/${post._id}`
        },
        deptNames[post.department] || post.department
      );


      post.notificationsSent = true;
      post.notificationSentAt = new Date();
      post.recipientCount = recipients.length;
      await post.save();


      const historyPromises = usersToNotify.map(user => {
        user.notificationHistory.push({
          department: post.department,
          postId: post._id,
          sentAt: new Date()
        });
        return user.save();
      });
      await Promise.all(historyPromises);

      console.log(`✅ Notifications sent for post ${postId} to ${recipients.length} users`);
      
      return {
        success: true,
        recipientCount: recipients.length
      };
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }

  async triggerNotification(req, res) {
    try {
      const { postId } = req.body;

      const result = await this.sendPostNotifications(postId);

      res.json({
        success: true,
        message: 'Notifications sent successfully',
        ...result
      });
    } catch (error) {
      console.error('Error triggering notification:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
    }
  }

  async getNotificationHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;

      const user = await User.findById(userId)
        .select('notificationHistory')
        .populate({
          path: 'notificationHistory.postId',
          select: 'title content department createdAt',
          populate: {
            path: 'author',
            select: 'username'
          }
        });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const history = user.notificationHistory
        .sort((a, b) => b.sentAt - a.sentAt)
        .slice((page - 1) * limit, page * limit);

      res.json({
        success: true,
        history,
        total: user.notificationHistory.length,
        page: parseInt(page),
        pages: Math.ceil(user.notificationHistory.length / limit)
      });
    } catch (error) {
      console.error('Error fetching notification history:', error);
      res.status(500).json({ error: 'Failed to fetch notification history' });
    }
  }

  async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { notificationId } = req.params;

      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const notification = user.notificationHistory.id(notificationId);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      notification.read = true;
      await user.save();

      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.notificationHistory.forEach(notification => {
        notification.read = true;
      });

      await user.save();

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      res.status(500).json({ error: 'Failed to mark all as read' });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId).select('notificationHistory');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const unreadCount = user.notificationHistory.filter(n => !n.read).length;

      res.json({
        success: true,
        unreadCount
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({ error: 'Failed to get unread count' });
    }
  }
}

export default new NotificationController();