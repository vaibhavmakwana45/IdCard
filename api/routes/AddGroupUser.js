const express = require("express");
const router = express.Router();
const moment = require("moment");
const AddGroupUser = require("../models/AddGroupUser");

const encrypt = (text) => {
  const cipher = crypto.createCipher("aes-256-cbc", "vaibhav");
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// const decrypt = (text) => {
//   const decipher = crypto.createDecipher("aes-256-cbc", "vaibhav");
//   let decrypted = decipher.update(text, "hex", "utf-8");
//   decrypted += decipher.final("utf-8");
//   return decrypted;
// };

const decrypt = (text) => {
  // Check if the text contains hexadecimal characters (indicative of encryption)
  const isEncrypted = /[0-9A-Fa-f]{6}/.test(text);

  // If the text is encrypted, decrypt it
  if (isEncrypted) {
    const decipher = crypto.createDecipher("aes-256-cbc", "vaibhav");
    let decrypted = decipher.update(text, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } else {
    return text;
  }
};

const currentDate = moment().utcOffset(330).format("YYYY-MM-DD HH:mm:ss");

router.post("/addgroupuser", async (req, res) => {
  try {
    const { userDetails } = req.body;

    const user = await AddGroupUser.findOne({ email: userDetails.email });

    if (user) {
      return res
        .status(200)
        .send({ statusCode: 201, message: "Group UserId already in use" });
    }

    const hashedPassword = encrypt(userDetails.password);

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, "0");
    const userId = `${timestamp}${randomString}${randomNumber}`;

    const newUser = new AddGroupUser({
      ...userDetails,
      user_id: userId,
      createdAt: currentDate,
      updatedAt: currentDate,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({
      success: true,
      message: "User added successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
