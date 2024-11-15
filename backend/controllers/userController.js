import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// API to Register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check for missing details
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details!" });
    }

    // check for validating the email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email!" });
    }

    // check for strong password
    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Enter the strong password!",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // saving the data in DB
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // creating a token so that user can login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { registerUser };
