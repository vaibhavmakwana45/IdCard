const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true,
  },
  fullname: {
    type: String,
  },
  usernumber: {
    type: String,
  },
  password: {
    type: String,
  },
  userimage: {
    type: String,
  },
  role: {
    type: String,
    default: "groupuser",
  },
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
});

module.exports = mongoose.model("AllGroupUser", UserSchema);
