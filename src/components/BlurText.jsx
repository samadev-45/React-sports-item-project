// src/components/BlurText.jsx
import { motion } from "framer-motion";

const BlurText = ({ text, className }) => {
  return (
    <motion.h1
      initial={{ opacity: 0, filter: "blur(12px)", y: -20 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 1 }}
      className={className}
    >
      {text}
    </motion.h1>
  );
};

export default BlurText;
