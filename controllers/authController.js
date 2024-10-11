// controllers/authController.js
const User = require("../models/User"); // Assuming you have a User model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
// Define a validation schema using Joi
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": `"Username" should be a type of 'text'`,
    "string.empty": `"Username" cannot be an empty field`,
    "string.min": `"Username" should have a minimum length of {#limit}`,
    "string.max": `"Username" should have a maximum length of {#limit}`,
    "any.required": `"Username" is a required field`,
  }),
  email: Joi.string().email().required().messages({
    "string.base": `"Email" should be a type of 'text'`,
    "string.empty": `"Email" cannot be an empty field`,
    "string.email": `"Email" must be a valid email`,
    "any.required": `"Email" is a required field`,
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": `"Password" should be a type of 'text'`,
    "string.empty": `"Password" cannot be an empty field`,
    "string.min": `"Password" should have a minimum length of {#limit}`,
    "any.required": `"Password" is a required field`,
  }),
});

// Define a validation schema using Joi
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `"Email" should be a type of 'text'`,
    "string.empty": `"Email" cannot be an empty field`,
    "string.email": `"Email" must be a valid email`,
    "any.required": `"Email" is a required field`,
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": `"Password" should be a type of 'text'`,
    "string.empty": `"Password" cannot be an empty field`,
    "string.min": `"Password" should have a minimum length of {#limit}`,
    "any.required": `"Password" is a required field`,
  }),
});

// Register a new user
const registerUser = async (req, res) => {
  // Validate user input
  const { error } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Collect all error messages
    const errorMessages = error.details.map(err => err.message);
    return res.status(400).json({ messages: errorMessages });
  }

  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ messages: ["Email already registered."] });
    } 
    
    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    // Respond with success
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ messages: ["Internal server error."] });
  }
};

// Log in a user
const loginUser = async (req, res) => {
  // Validate user input
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Collect all error messages
    const errorMessages = error.details.map(err => err.message);
    return res.status(400).json({ messages: errorMessages });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) return res.status(401).json({ messages: ["User not found"] });

    // Use the isValidPassword method for comparison
    const isValidPassword = await user.isValidPassword(password); 
    if (!isValidPassword) return res.status(401).json({ messages: ["Invalid password"] });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ messages: ["Error logging in"] });
  }
};


// Get current user
const getCurrentUser = async (req, res) => {
  try {
    // Fetch the user by ID while excluding the password field
    const user = await User.findById(req.user.id).select('-password'); // Use '-password' to exclude the password

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Return the user data without password
  } catch (error) {
    console.error("Error retrieving user:", error); // Log the error for debugging
    res.status(500).json({ message: "Error retrieving user" });
  }
};


const logoutUser = (req, res) => {
  res.status(200).json({ message: "User logged out successfully." });
};




module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser, 
};
