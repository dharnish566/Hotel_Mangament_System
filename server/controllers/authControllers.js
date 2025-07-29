import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

const ADMIN_EMAIL = "dharnish144@gmail.com";

// ✅ Register Controller
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      photo = "",
      role = "user",
      isGoogleUser = false,
      phone = "",
      address = ""
    } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    // 🔒 Hash password regardless of user type
    if (!password) return res.status(400).json({ message: "Password is required" });
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(password , hashedPassword);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      photo,
      role: email === ADMIN_EMAIL ? "admin" : role,
      isGoogleUser,
      phone,
      address
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ Manual Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2d" });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    const { credential } = req.body;
    const decoded = jwtDecode(credential);
    const { email, name, picture } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      // No auto-register
      return res.status(404).json({
        message: "User not found",
        email,
        name,
        picture,
        role: email === ADMIN_EMAIL ? "admin" : "user",
      });
    }

    // 🔐 Force role = admin if email matches
    if (email === ADMIN_EMAIL && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

