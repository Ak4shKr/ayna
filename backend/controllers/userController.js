import User from "../models/user.js";
import { generateToken } from "../utils/jwt.js";

export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ error: "User already exists" });
  }

  const user = new User({ name, email, password });
  const userSafedata = user.toObject();
  delete userSafedata.password;
  await user.save();
  res.status(201).json({
    status: true,
    message: "User registered successfully",
    data: { user: userSafedata },
  });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = generateToken({ user: user });

  res.status(200).json({
    status: true,
    message: "User logged in successfully",
    data: {
      user: { name: user.name, email: user.email },
      token: token,
    },
  });
};
