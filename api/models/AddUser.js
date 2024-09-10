const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true,
  },
  fullname: {
    type: String,
  },
  userimage: {
    type: String,
  },
  group_id: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
});

module.exports = mongoose.model("AllUser", UserSchema);
