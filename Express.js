const BlogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [{ body: String, date: Date }],
  });
  
  const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
  
  app.post('/posts', async (req, res) => {
    const { title, content, author } = req.body;
    const post = new BlogPost({ title, content, author });
    await post.save();
    res.status(201).send(post);
  });
  
  app.get('/posts', async (req, res) => {
    const posts = await BlogPost.find().populate('author');
    res.status(200).send(posts);
  });
  
  app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = await BlogPost.findByIdAndUpdate(id, { title, content }, { new: true });
    res.status(200).send(post);
  });
  
  app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    res.status(200).send({ message: 'Post deleted successfully' });
  });
  