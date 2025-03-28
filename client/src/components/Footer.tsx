import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { globalStyles } from "@/lib/global-styles";

const Footer = () => {
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    
    e.currentTarget.reset();
  };

  return (
    <footer className="bg-restaurant-text text-white py-16">
      <div className={`${globalStyles.layout.container}`}>
        <div className={`${globalStyles.layout.grid4}`}>
          {/* Restaurant Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className={`text-2xl font-bold font-heading mb-4 bg-gradient-to-r from-restaurant-secondary to-amber-400 bg-clip-text text-transparent`}>Savoria</h3>
            <p className="mb-6 text-gray-300 font-body leading-relaxed">
              Experience the art of fine dining with our exquisite dishes prepared by world-class chefs.
            </p>
            <div className="flex space-x-4">
              <motion.button 
                className="text-gray-300 hover:text-restaurant-secondary p-2 rounded-full border border-gray-700 hover:border-restaurant-secondary transition-all duration-300 transform hover:scale-110" 
                aria-label="Facebook"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook size={18} />
              </motion.button>
              <motion.button 
                className="text-gray-300 hover:text-restaurant-secondary p-2 rounded-full border border-gray-700 hover:border-restaurant-secondary transition-all duration-300 transform hover:scale-110" 
                aria-label="Instagram"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram size={18} />
              </motion.button>
              <motion.button 
                className="text-gray-300 hover:text-restaurant-secondary p-2 rounded-full border border-gray-700 hover:border-restaurant-secondary transition-all duration-300 transform hover:scale-110" 
                aria-label="Twitter"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter size={18} />
              </motion.button>
              <motion.button 
                className="text-gray-300 hover:text-restaurant-secondary p-2 rounded-full border border-gray-700 hover:border-restaurant-secondary transition-all duration-300 transform hover:scale-110" 
                aria-label="Mail"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={18} />
              </motion.button>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className={`${globalStyles.text.headingMd} mb-5 text-restaurant-secondary`}>Quick Links</h4>
            <ul className="space-y-3 font-body">
              <li>
                <Link href="/" className={`text-gray-300 hover:text-white ${globalStyles.transitions.medium} flex items-center group`}>
                  <span className="w-0 group-hover:w-2 h-0.5 bg-restaurant-secondary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className={`text-gray-300 hover:text-white ${globalStyles.transitions.medium} flex items-center group`}>
                  <span className="w-0 group-hover:w-2 h-0.5 bg-restaurant-secondary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/reservation" className={`text-gray-300 hover:text-white ${globalStyles.transitions.medium} flex items-center group`}>
                  <span className="w-0 group-hover:w-2 h-0.5 bg-restaurant-secondary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Reservation
                </Link>
              </li>
              <li>
                <Link href="/reviews" className={`text-gray-300 hover:text-white ${globalStyles.transitions.medium} flex items-center group`}>
                  <span className="w-0 group-hover:w-2 h-0.5 bg-restaurant-secondary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`text-gray-300 hover:text-white ${globalStyles.transitions.medium} flex items-center group`}>
                  <span className="w-0 group-hover:w-2 h-0.5 bg-restaurant-secondary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className={`${globalStyles.text.headingMd} mb-5 text-restaurant-secondary`}>Opening Hours</h4>
            <ul className="space-y-4 text-gray-300 font-body">
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-3 text-restaurant-secondary/70" />
                <span className="text-sm">
                  <span className="text-white font-semibold">Mon - Thu:</span> 11:00 AM - 10:00 PM
                </span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-3 text-restaurant-secondary/70" />
                <span className="text-sm">
                  <span className="text-white font-semibold">Fri - Sat:</span> 11:00 AM - 11:30 PM
                </span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-3 text-restaurant-secondary/70" />
                <span className="text-sm">
                  <span className="text-white font-semibold">Sunday:</span> 10:00 AM - 10:00 PM
                </span>
              </li>
              <li className="flex items-center mt-6">
                <MapPin className="w-4 h-4 mr-3 text-restaurant-secondary/70" />
                <span className="text-sm">123 Restaurant St, City, State 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-restaurant-secondary/70" />
                <span className="text-sm">(123) 456-7890</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className={`${globalStyles.text.headingMd} mb-5 text-restaurant-secondary`}>Newsletter</h4>
            <p className="mb-5 text-gray-300 font-body">
              Subscribe to our newsletter for special offers and updates on new menus and events.
            </p>
            <form className="flex flex-col space-y-2" onSubmit={handleSubscribe}>
              <Input
                type="email"
                name="email"
                placeholder="Your email address"
                className="border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-400 py-5 rounded-md focus-visible:ring-restaurant-secondary focus-visible:border-restaurant-secondary"
              />
              <Button 
                type="submit" 
                className={`${globalStyles.buttons.primary} w-full py-5 mt-2`}
              >
                <Mail size={18} className="mr-2" />
                Subscribe Now
              </Button>
            </form>
          </motion.div>
        </div>
        
        <div className="border-t border-gray-700/50 mt-12 pt-8 text-center text-gray-400">
          <p className="font-body text-sm">&copy; {new Date().getFullYear()} Savoria Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
