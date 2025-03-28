import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../contexts/CartContext";
import Cart from "./Cart";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const isMobile = useIsMobile();
  
  // Determine if current page has a dark background (home page only)
  const isHomePage = location === "/";
  
  // Default to "scrolled" look on non-home pages
  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true);
    } else {
      // Check initial scroll position
      setScrolled(window.scrollY > 20);
    }
  }, [isHomePage]);

  // Handle scroll event to change navbar appearance and hide on scroll down
  useEffect(() => {
    // Only apply scroll behavior on home page
    if (!isHomePage) return;
    
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
  }, [prevScrollPos, isHomePage]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/reservation", label: "Reservation" },
    { href: "/track-order", label: "Track Order" },
    { href: "/my-orders", label: "My Orders" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible ? 'translate-y-0' : isHomePage ? '-translate-y-full' : 'translate-y-0'
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
          <div className="flex items-center space-x-4">
            {/* Checkout Button - Desktop only */}
            <Link 
              href="/checkout" 
              className={`hidden md:flex items-center gap-1 transition-colors duration-300 ${
                scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-primary/90'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
                <path d="M12 12V8l4 4-4 4v-4" />
              </svg>
              <span className="text-sm font-medium">Checkout</span>
            </Link>
            
            {/* Cart Link */}
            <Link 
              href="/cart"
              className={`relative flex items-center justify-center p-2.5 rounded-full transition-all duration-300 ${
                scrolled 
                  ? 'bg-white hover:bg-primary/10 text-primary shadow-md border border-gray-100' 
                  : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
              }`}
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
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
              
              <div className="flex flex-col space-y-4">
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
                      View Menu
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    className="w-full bg-primary/20 hover:bg-primary/30 text-white py-6 rounded-md text-lg border border-white/20"
                    onClick={() => setMobileMenuOpen(false)}
                    asChild
                  >
                    <Link href="/cart">
                      View Cart
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Cart Dropdown */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            key="cart-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Cart onClose={() => setCartOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
