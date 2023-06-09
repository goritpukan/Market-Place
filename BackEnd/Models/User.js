const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname: { type: String },
  email: { type: String },
  password: { type: String },
  avatar: { type: String, default: "defaultIcon.png" },

});
const User = mongoose.model('users', userSchema);

module.exports = User;