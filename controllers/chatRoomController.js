const ChatRoom = require("../models/ChatRoom"); // Assuming you have a ChatRoom model
const Joi = require("joi");

// Define a validation schema using Joi for creating a chat room
const chatRoomSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be an empty field`,
    "string.min": `"name" should have a minimum length of {#limit}`,
    "string.max": `"name" should have a maximum length of {#limit}`,
    "any.required": `"name" is a required field`,
  }),
  description: Joi.string().max(200).optional().messages({
    "string.base": `"Description" should be a type of 'text'`,
    "string.max": `"Description" should have a maximum length of {#limit}`,
  }),
});

// Create a new chat room
const createChatRoom = async (req, res) => {
  // Validate user input
  const { error } = chatRoomSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Collect all error messages
    const errorMessages = error.details.map(err => err.message);
    return res.status(400).json({ messages: errorMessages });
  }

  const { name, description } = req.body;

  try {
    // Create a new chat room
    const newChatRoom = new ChatRoom({ name, description });
    await newChatRoom.save();

    // Respond with success
    res.status(201).json({ message: "Chat room created successfully.", chatRoom: newChatRoom });
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ messages: ["Internal server error."] });
  }
};

// Retrieve a list of all available chat rooms
const getChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find(); // Fetch all chat rooms
    res.json(chatRooms); // Return the list of chat rooms
  } catch (error) {
    console.error("Error retrieving chat rooms:", error);
    res.status(500).json({ messages: ["Internal server error."] });
  }
};

// Get details of a specific chat room
const getChatRoomDetails = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(roomId); // Find chat room by ID

    if (!chatRoom) {
      return res.status(404).json({ messages: ["Chat room not found."] });
    }

    res.json(chatRoom); // Return chat room details
  } catch (error) {
    console.error("Error retrieving chat room details:", error);
    res.status(500).json({ messages: ["Internal server error."] });
  }
};

module.exports = {
  createChatRoom,
  getChatRooms,
  getChatRoomDetails,
};
