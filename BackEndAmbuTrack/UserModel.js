const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { type: String, unique: true },
  phone: { type: Number, unique: true },
  password: String,
  fullname: String,
  gender: String,
  Dob: Date,
});

module.exports = mongoose.model("userInfo", userSchema);
