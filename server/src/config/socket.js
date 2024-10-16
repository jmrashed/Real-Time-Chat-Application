const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const { saveMessage, getMessages } = require("../services/chatService");
const { saveFile } = require("../services/fileService");
const File = require('../models/File');
const logger = require("../utils/logger");
const { createChatRoom, ChatRoom } = require("../models/ChatRoom");
const path = require('path');
const { saveFileToDisk } = require("../utils/fileUplaod");
const fs = require('fs');
const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,
    },
  });

  // Middleware to authenticate socket connections using JWT
  io.use((socket, next) => {
    const token = socket.handshake.query?.token;
    if (!token) {
      logger.warn("No token provided");
      return next(new Error("AUTHENTICATION_ERROR"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.warn("Invalid token");
        return next(new Error("AUTHENTICATION_ERROR"));
      }
      socket.decoded = decoded;
      next();
    });
  });

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on("join room", async (room) => {
      try {
        const chatRoom = await ChatRoom.findOne({ name: room });
        if (chatRoom) {
          socket.join(room);
          logger.info(`User ${socket.id} joined room: ${room}`);
          io.to(room).emit("user joined", socket.id);
        } else {
          socket.emit("error", "Room does not exist");
        }
      } catch (error) {
        logger.error("Error joining room:", error);
        socket.emit("error", "Error joining room");
      }
    });

    socket.on("room list", async (callback) => {
      try {
        const chatRooms = await ChatRoom.find();
        if (callback && typeof callback === "function") {
          callback(chatRooms);
        } else {
          socket.emit("chat list", chatRooms);
        }
      } catch (error) {
        logger.error("Error fetching chat rooms:", error);
        socket.emit("error", "Error fetching chat rooms");
      }
    });

    socket.on("get messages", async (roomId, page = 0, callback) => {
      try {
        const limit = 50;
        const skip = page * limit;
        const messages = await getMessages(roomId, limit, skip);
        if (callback && typeof callback === "function") {
          callback(messages);
        } else {
          socket.emit("messages", messages);
        }
      } catch (error) {
        logger.error("Error fetching messages:", error);
        socket.emit("error", "Error fetching messages");
      }
    });

    socket.on("create room", async (roomData) => {
      try {
        roomData.users = [socket.decoded.id];
        const newRoom = await createChatRoom(roomData);
        socket.join(newRoom.name);
        logger.info(`Room created: ${newRoom.name}`);
        io.emit("room created", newRoom);
      } catch (error) {
        logger.error("Error creating room:", error);
        socket.emit("error", "Error creating room");
      }
    });

    socket.on("leave room", (room) => {
      socket.leave(room);
      logger.info(`User ${socket.id} left room: ${room}`);
      io.to(room).emit("user left", socket.id);
    });

    socket.on("chat message", async (messageData) => {
      try {
        const { room, message, fileId } = messageData;
        const newMessage = {
          content: message,
          room: room,
          sender: socket.decoded.id,
          timestamp: new Date(),
        };
        if(fileId){
          newMessage.fileId = fileId;          
        }
        

        const savedMessage = await saveMessage(newMessage);

        // Emit the new message to all users in the room
        socket.broadcast.emit('new message', savedMessage);
        // Also emit the new message to the sender
        socket.emit("new message", savedMessage);
      } catch (error) {
        logger.error("Error sending message:", error);
        socket.emit("error", "Error sending message");
      }
    });

    socket.on("file upload", async (fileData, callback) => {
      try {
        const { room, file, fileName, fileType } = fileData;
        // console.log("Received file data:", fileData);
    
        const UPLOAD_DIR = path.join(__dirname, 'uploads');
        const destinationPath = path.join(UPLOAD_DIR, fileName);
        
        // Convert ArrayBuffer to Buffer
        const buffer = Buffer.from(file);
    
        // Save the file to disk
        await fs.promises.writeFile(destinationPath, buffer);
        // console.log("File saved to:", destinationPath);
    
        const newFile = new File({
          filename: fileName,
          contentType: fileType,
          size: buffer.length, // Use the size of the buffer
          uploadedBy: socket.decoded.id,
          uploadedAt: new Date(),
        });
    
        const savedFile = await newFile.save();
    
        // Create a new message for the file
        const fileMessage = {
          content: `File: ${fileName}`,
          room: room,
          sender: socket.decoded.id,
          timestamp: new Date(),
          file: savedFile._id,
        };
    
        const savedMessage = await saveMessage(fileMessage);
    
        // Emit the new message to all users in the room
        socket.broadcast.emit('new message', savedMessage);
        // Also emit the new message to the sender
        socket.emit("new message", savedMessage);
    
        callback({ fileId: savedFile.id, message: savedMessage });
      } catch (error) {
        logger.error("Error saving file:", error);
        callback({ error: "Error saving file" });
      }
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initializeSocket };
