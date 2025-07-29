import React from "react";
import { motion } from "framer-motion";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

const SignInCard = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white shadow-xl"
      >
        <LeftSection />
        <RightSection />
      </motion.div>
    </div>
  );
};

export default SignInCard;
