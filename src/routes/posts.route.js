const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts.controller.js');
const postsController = new PostsController();

router.post('/', postsController.createPost);
router.get('/', postsController.getPosts);
router.get('/:postId', postsController.getPostById);
router.put('/:postId', postsController.updatePost);
router.delete('/:postId', postsController.deletePost);

module.exports = router;
