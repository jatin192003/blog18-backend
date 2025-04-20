const express = require('express');
const router = express.Router();
const { createPost, getAllPosts } = require('../controllers/postController');
const upload = require('../middleware/upload');

router.post('/add-post', upload.single('image'), createPost);
router.get('/posts', getAllPosts);

module.exports = router;
