const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { saveMessage } = require('../services/chatService');
const { saveFile } = require('../services/fileService');
const logger = require('../utils/logger');

const initializeSocket = (server) => {
  const io = socketIo(server);

  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  }).on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('join room', (room) => {
      socket.join(room);
      logger.info(`User joined room: ${room}`);
    });

    socket.on('leave room', (room) => {
      socket.leave(room);
      logger.info(`User left room: ${room}`);
    });

    socket.on('chat message', async (data) => {
      try {
        const savedMessage = await saveMessage(data);
        io.to(data.room).emit('chat message', savedMessage);
      } catch (error) {
        logger.error('Error saving message:', error);
        socket.emit('error', 'Error saving message');
      }
    });

    socket.on('file upload', async (file, callback) => {
      try {
        const savedFile = await saveFile(file);
        callback({ fileId: savedFile.id });
        io.to(file.room).emit('file shared', savedFile);
      } catch (error) {
        logger.error('Error saving file:', error);
        callback({ error: 'Error saving file' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initializeSocket };