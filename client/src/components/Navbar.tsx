import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Phone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../contexts/CartContext";
import Cart from "./Cart";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { globalStyles } from "@/lib/global-styles";

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
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            <span className={`font-heading text-2xl font-bold transition-colors duration-300 ${
              scrolled ? 'text-restaurant-primary' : 'text-white'
            } drop-shadow-sm`}>
              SAVORIA
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`relative font-heading font-medium text-[0.9rem] xl:text-sm uppercase tracking-wide transition-all duration-300 ease-in-out py-2 group ${
                  location === link.href 
                    ? scrolled ? `${globalStyles.colors.primary} font-semibold` : `${globalStyles.colors.secondary} font-semibold` 
                    : scrolled ? `${globalStyles.colors.text} hover:${globalStyles.colors.primary}` : `text-white hover:${globalStyles.colors.secondary}`
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 ${scrolled ? 'bg-restaurant-primary' : 'bg-restaurant-secondary'} transform scale-x-0 origin-left transition-transform duration-300 ${
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
              className={`hidden md:flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                scrolled ? 
                  'text-restaurant-primary border border-restaurant-primary/30 hover:bg-restaurant-primary/5 hover:shadow-sm' : 
                  'text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm font-medium font-heading">Checkout</span>
            </Link>
            
            {/* Cart Link */}
            <Link 
              href="/cart"
              className={`relative flex items-center justify-center p-2.5 rounded-full transition-all duration-300 ease-in-out ${
                scrolled 
                  ? `bg-white hover:bg-restaurant-primary/5 ${globalStyles.colors.primary} shadow-sm hover:shadow-md border border-gray-100` 
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
                    className="absolute -top-2 -right-2 bg-[#D72638] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className={`lg:hidden z-10 transition-colors duration-300 ${
                mobileMenuOpen ? 'text-white' : (scrolled ? 'text-restaurant-text' : 'text-white')
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
          <>
            {/* Backdrop overlay that closes menu when clicked */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile menu content */}
            <motion.div 
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-gradient-to-br from-black/95 to-restaurant-primary/90 z-50 flex flex-col justify-center items-center shadow-2xl"
            >
              {/* Close button in top right */}
              <button 
                className="absolute top-6 right-6 text-white/80 hover:text-white transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, staggerChildren: 0.1 }}
                className="w-full max-w-md px-8"
              >
                <nav className="flex flex-col space-y-7 text-center mb-14">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="overflow-hidden py-1"
                    >
                      <Link 
                        href={link.href} 
                        className={`relative block text-white text-[1.2rem] font-heading font-medium tracking-wide hover:text-restaurant-secondary transition-all duration-300 ease-in-out group ${
                          location === link.href ? 'text-restaurant-secondary font-semibold' : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                        {/* Animated underline effect */}
                        <span 
                          className={`absolute bottom-0 left-0 w-0 h-0.5 bg-restaurant-secondary transition-all duration-300 ease-in-out ${
                            location === link.href ? 'w-full' : 'group-hover:w-full'
                          }`}
                        />
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
                      className={`w-full bg-white hover:bg-white/90 ${globalStyles.colors.primary} py-6 rounded-lg text-lg font-heading font-semibold ${globalStyles.shadows.hover} ${globalStyles.transitions.button}`}
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
                      className={`w-full bg-transparent hover:bg-white/10 text-white py-6 rounded-lg text-lg border border-white/20 font-heading font-semibold transition-all duration-300 ease-in-out`}
                      onClick={() => setMobileMenuOpen(false)}
                      asChild
                    >
                      <Link href="/cart">
                        <ShoppingCart className="w-5 h-5 mr-2 inline-block" />
                        View Cart
                      </Link>
                    </Button>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-10 left-0 right-0 text-center"
                >
                  <a 
                    href="tel:+1234567890" 
                    className="inline-flex items-center justify-center gap-2 text-white/80 hover:text-white transition-all duration-300"
                  >
                    <Phone size={18} />
                    <span className="font-medium">(123) 456-7890</span>
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
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
