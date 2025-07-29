import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, default: null },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isGoogleUser: { type: Boolean, default: false },
  photo: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  otp: String,
  otpExpiry: Date,
});

const User = mongoose.model("User", userSchema);

export default User;
