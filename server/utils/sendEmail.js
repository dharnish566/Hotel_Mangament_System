import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

});

// console.log(process.env.EMAIL_PASS , process.env.EMAIL_USER);

export const sendOTPEmail = async (to, otp) => {
    console.log("reached sendotp");
    try {
        console.log("Sending email to:", to);
        console.log("Using EMAIL_USER:", process.env.EMAIL_USER);

        const info = await transporter.sendMail({
            from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Your Password Reset OTP",
            html: `<p>Your OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
        });

        console.log("Email sent successfully:", info.response);
    } catch (error) {
        console.error("❌ Failed to send email:", error.message);
        console.error("🔍 Full error object:", error);
    }
};

