const mongoose = require("mongoose");

const SavajCapital_UserSchema = new mongoose.Schema({
  group_id: {
    type: String,
    unique: true,
  },
  groupname: {
    type: String,
  },
  groupnumber: {
    type: String,
  },
  groupmobilnumber: {
    type: String,
  },
  groupcount: {
    type: String,
  },
  groupimage: {
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

module.exports = mongoose.model("Savaj_Capital-users", SavajCapital_UserSchema);
