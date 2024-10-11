const User = require("../models/User"); // Assuming you have a User model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {
  sendSuccessResponse,
  sendCreatedResponse,
  sendClientErrorResponse,
  sendNotFoundResponse,
  sendInternalServerErrorResponse,
  sendUnauthorizedResponse,
} = require("../utils/responseFormatter"); // Corrected import path

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

// Define a validation schema for login using Joi
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
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map(err => err.message);
    return sendClientErrorResponse(res, "Validation failed", errorMessages);
  }

  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendClientErrorResponse(res, "Email already registered.", ["Email already registered."]);
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return sendCreatedResponse(res, "User registered successfully.", { userId: newUser._id });
  } catch (error) {
    console.error("Error registering user:", error);
    return sendInternalServerErrorResponse(res, "Internal server error.");
  }
};

// Log in a user
const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map(err => err.message);
    return sendClientErrorResponse(res, "Validation failed", errorMessages);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return sendUnauthorizedResponse(res, "User not found");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return sendUnauthorizedResponse(res, "Invalid password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return sendSuccessResponse(res, "Login successful", { token });
  } catch (error) {
    console.error("Error logging in:", error);
    return sendInternalServerErrorResponse(res, "Error logging in");
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return sendNotFoundResponse(res, "User not found");

    return sendSuccessResponse(res, "User retrieved successfully", user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return sendInternalServerErrorResponse(res, "Error retrieving user");
  }
};

// Log out a user
const logoutUser = (req, res) => {
  return sendSuccessResponse(res, "User logged out successfully.");
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};
