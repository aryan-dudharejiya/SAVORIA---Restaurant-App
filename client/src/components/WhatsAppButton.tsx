import { MessageSquare } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/15551234567" 
      className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full shadow-lg p-4 z-40 hover:bg-green-600 transition"
      aria-label="Chat on WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageSquare className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;
