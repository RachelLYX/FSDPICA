const express = require('express');
const router = express.Router();
const forumController = require('../../controllers/forum_controllers/forum.controller');

router.get('/', forumController.getAllForums);
router.post('/create', forumController.createForum);
router.get('/:forumId', forumController.getForumById);
router.post('/reply/:threadId', forumController.replyToPost);
router.post('/threads/:parentThreadId/reply', forumController.replyToThread);
router.put('/forums/:forumId/vote', forumController.postVote);
router.put('/messages/:messageId/vote', forumController.messageVote);

module.exports = router;
