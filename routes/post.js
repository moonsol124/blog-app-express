const express = require('express');
const router = express.Router();
const async = require("async");
const Post = require('../models/post');
const postController = require('../controllers/postController');

router.get('/posts', postController.posts)
router.get('/post/:id/', postController.post_detail);
router.get('/post/create_post', postController.create_post_get);
router.post('/post/create_post', postController.create_post_post);
router.get('/post/:id/update_post', postController.update_post_get);
router.put('/post/:id/update_post', postController.update_post_post);
router.get('/post/:id/delete_post', postController.delete_post_get);
router.delete('/post/:id/delete_post', postController.delete_post_post);

module.exports = router;