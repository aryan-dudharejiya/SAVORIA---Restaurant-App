import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../contexts/CartContext";
import Cart from "./Cart";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // Handle scroll event to change navbar appearance and hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Determine if user is scrolling up or down
      const isScrollingDown = currentScrollPos > prevScrollPos;
      
      // Only hide navbar when scrolling down and not at the top of the page
      setVisible((!isScrollingDown && currentScrollPos > 100) || currentScrollPos < 10);
      setScrolled(currentScrollPos > 20);
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/reservation", label: "Reservation" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled 
          ? 'bg-white shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            <span className={`font-heading text-2xl font-bold transition-colors duration-300 ${
              scrolled ? 'text-primary' : 'text-white'
            } drop-shadow-sm`}>
              SAVORIA
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`relative font-medium text-sm uppercase tracking-wide transition-colors duration-300 py-2 group ${
                  location === link.href 
                    ? scrolled ? 'text-primary font-semibold' : 'text-primary font-semibold' 
                    : scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-primary/90'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 origin-left transition-transform duration-300 ${
                  location === link.href ? 'scale-x-100' : 'group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-6">
            {/* Phone Button (visible only on desktop) */}
            <a 
              href="tel:+1234567890" 
              className={`hidden md:flex items-center gap-2 transition-colors duration-300 ${
                scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-primary/90'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Order by Phone</span>
            </a>
            
            {/* Cart Button */}
            <button 
              className={`relative transition-colors duration-300 ${
                scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-primary/90'
              }`}
              onClick={() => setCartOpen(!cartOpen)}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            
            {/* CTA Button */}
            <Button 
              className="hidden md:flex bg-primary hover:bg-primary/90 text-white rounded-md px-5 shadow-sm"
              size="sm"
              asChild
            >
              <Link href="/menu">
                Order Online
              </Link>
            </Button>
            
            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden z-10 transition-colors duration-300 ${
                mobileMenuOpen ? 'text-white' : (scrolled ? 'text-gray-800' : 'text-white')
              }`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu - Animated Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gradient-to-br from-black/95 to-primary/90 z-40 flex flex-col justify-center items-center"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, staggerChildren: 0.1 }}
              className="w-full max-w-md px-6"
            >
              <nav className="flex flex-col space-y-6 text-center mb-10">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Link 
                      href={link.href} 
                      className={`text-white text-2xl font-medium hover:text-primary/50 transition-colors ${
                        location === link.href ? 'text-primary/80' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  className="w-full bg-white hover:bg-white/90 text-primary py-6 rounded-md text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                  asChild
                >
                  <Link href="/menu">
                    Order Now
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Cart Dropdown */}
      <AnimatePresence>
        {cartOpen && <Cart onClose={() => setCartOpen(false)} />}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
