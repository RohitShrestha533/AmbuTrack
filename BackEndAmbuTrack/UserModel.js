const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { type: String, unique: true },
  phone: { type: Number, unique: true },
  password: String,
});

module.exports = mongoose.model("userInfo", userSchema);
