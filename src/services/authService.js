const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.createUser = async (username, password) => {
  const user = new User({ username, password });
  await user.save();
  return user;
};

exports.loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid username or password');
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return { token, user };
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};