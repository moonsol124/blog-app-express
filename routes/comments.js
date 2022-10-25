const commentController = require("../controllers/commentController");
const express = require('express');
const router = express.Router();
const async = require("async");

router.get('/post/:id/comments', commentController.comments);
router.get('/post/:postid/comment/:commentid', commentController.comment_detail);
router.get('/post/:id/create_comment/', commentController.create_comment_get);
router.post('/post/:id/create_comment/', commentController.create_comment_post);
router.get('/post/:postid/comment/:commentid/update_comment', commentController.update_comment_get);
router.put('/post/:postid/comment/:commentid/update_comment', commentController.update_comment_put);
router.get('/post/:postid/comment/:commentid/delete_comment', commentController.delete_comment_get);
router.delete('/post/:postid/comment/:commentid/delete_comment', commentController.delete_comment_delete);

module.exports = router;