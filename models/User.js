const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure username is unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    match: /.+\@.+\..+/, // Basic email validation regex
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set default to current time
  },
});

// Method to hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if the password has been modified
  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});


// Method to validate password
UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare provided password with hashed password
};

// Create the User model
const User = mongoose.model("User", UserSchema);

module.exports = User;
