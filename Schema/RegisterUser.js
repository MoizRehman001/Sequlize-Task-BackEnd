const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  role: {
    type: Number,
    required: true,
  },
  document: {
    type: String, // Path to the uploaded document
  },
  documentApproved: {
    type: Boolean,
    default: false, // Default to false, assuming documents need approval
  },
});

module.exports = mongoose.model("Register", userSchema);
