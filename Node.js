const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/blog_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send({ message: 'Invalid credentials' });
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return res.status(400).send({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id }, 'secretkey');
  res.status(200).send({ token });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
