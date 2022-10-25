const express = require('express');
const router = express.Router();
const async = require("async");
const Picture = require('../models/picture');
const pictureController = require('../controllers/pictureController');

router.get('/album', pictureController.album)
router.get('/picture/:id/', pictureController.picture_detail);
router.post('/picture/:id/get_heart', pictureController.get_heart);
router.put('/picture/:id/update_heart', pictureController.update_heart);
// router.get('/picture/create_picture', pictureController.create_picture_get);
router.post('/picture/create_picture', pictureController.create_picture_post);
// router.get('/picture/:id/update_picture', pictureController.update_picture_get);
// router.put('/picture/:id/update_picture', pictureController.update_picture_post);
// router.get('/picture/:id/delete_picture', pictureController.delete_picture_get);
// router.delete('/picture/:id/delete_picture', pictureController.delete_picture_post);

module.exports = router;