import express from "express";
import {
    register,
    login,
    googleSignIn,
} from "../controllers/authControllers.js";
import { requestPasswordReset, verifyOTPAndResetPassword } from "../controllers/OtpControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleSignIn);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', verifyOTPAndResetPassword);

export default router;
