const Post = require('../model/Post.js');

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file.path;

    const newPost = new Post({ title, content, imageUrl });
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
