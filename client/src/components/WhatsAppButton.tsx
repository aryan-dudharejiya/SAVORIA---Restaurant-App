import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
  return (
    <motion.a 
      href="https://wa.me/15551234567" 
      className="fixed bottom-6 right-6 bg-restaurant-accent text-white rounded-full shadow-hover p-4 z-40 hover:bg-restaurant-accent/90 transition-all duration-300 ring-offset-2 ring-restaurant-accent/20 hover:ring-2"
      aria-label="Chat on WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageSquare className="w-6 h-6" />
    </motion.a>
  );
};

export default WhatsAppButton;
