const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); // Create a JWT token
    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ message: "Error logging in user" });
  }
};

// Get the current authenticated user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password from response
    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    res.status(500).json({ message: "Error fetching current user" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
