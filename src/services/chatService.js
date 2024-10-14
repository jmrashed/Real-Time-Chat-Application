const Message = require('../models/Message');

exports.saveMessage = async (messageData) => {
  const message = new Message(messageData);
  await message.save();
  return message;
};

exports.getMessages = async (room, limit = 50, skip = 0) => {
  return Message.find({ room })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'username')
    .populate('file', 'filename');
};