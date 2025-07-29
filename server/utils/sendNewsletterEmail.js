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

export const sendNewsletterEmail = async (userEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `"Newsletter Signup" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to admin (your Gmail)
      subject: "New Newsletter Subscriber",
      html: `<p>New user subscribed with the email: <b>${userEmail}</b></p>`,
    });

    console.log("✅ Newsletter email sent:", info.response);
  } catch (error) {
    console.error("❌ Failed to send newsletter email:", error.message);
    throw error;
  }
};
