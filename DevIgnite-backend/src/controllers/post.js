const Post = require('../models/Post');
const User = require('../models/User');
const notificationController = require('./notificationController');

class PostsController {
  async createPost(req, res) {
    try {
      const { title, content, department, images, attachments, tags, status } = req.body;
      const authorId = req.user.id;

      const post = new Post({
        title,
        content,
        department,
        author: authorId,
        images: images || [],
        attachments: attachments || [],
        tags: tags || [],
        status: status || 'published'
      });

      await post.save();

      // If the post is published, send notifications automatically
      if (post.status === 'published') {
        notificationController.sendPostNotifications(post._id).catch(err => {
          console.error('Error sending notifications:', err);
        });
      }

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        post,
        notificationsPending: post.status === 'published'
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  }

  /**
   * Publish a draft post and send notifications
   */
  async publishPost(req, res) {
    try {
      const { postId } = req.params;

      const post = await Post.findById(postId);
      
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.status === 'published') {
        return res.status(400).json({ error: 'Post is already published' });
      }

      post.status = 'published';
      await post.save();

      notificationController.sendPostNotifications(post._id).catch(err => {
        console.error('Error sending notifications:', err);
      });

      res.json({
        success: true,
        message: 'Post published successfully',
        post,
        notificationsPending: true
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      res.status(500).json({ error: 'Failed to publish post' });
    }
  }

}

module.exports = new PostsController();