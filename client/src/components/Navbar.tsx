import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Phone, ChevronRight, CalendarDays } from "lucide-react";
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
  const bodyRef = useRef<HTMLElement | null>(null);
  
  // Determine if current page has a dark background (home page only)
  const isHomePage = location === "/";
  
  // Effect to handle body scroll locking when mobile menu is open
  useEffect(() => {
    bodyRef.current = document.body;
    
    if (mobileMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock the body scroll by setting fixed position and preserving scroll position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';
    } else if (bodyRef.current) {
      // Unlock the body scroll when menu closes
      const scrollY = bodyRef.current.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY.replace('-', '').replace('px', '')));
      }
    }
    
    return () => {
      // Clean up in case component unmounts with menu open
      if (bodyRef.current) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
      }
    };
  }, [mobileMenuOpen]);
  
  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [mobileMenuOpen]);
  
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
            
            {/* Mobile Menu Button - Larger and touch-friendly */}
            <button 
              className={`lg:hidden z-10 flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 ease-in-out active:scale-95 ${
                mobileMenuOpen 
                  ? 'text-white bg-white/10 backdrop-blur-sm'
                  : scrolled 
                    ? 'text-restaurant-text hover:bg-gray-100/90' 
                    : 'text-white hover:bg-white/10 backdrop-blur-sm'
              }`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mobile menu"
            >
              {mobileMenuOpen 
                ? <X size={24} className="transform transition-transform duration-300" /> 
                : <Menu size={24} className="transform transition-transform duration-300" />
              }
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
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9998] will-change-[opacity]"
              style={{ backfaceVisibility: "hidden", pointerEvents: 'auto' }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile menu content */}
            <motion.div 
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ 
                duration: 0.3, 
                ease: [0.32, 0.72, 0, 1],
                opacity: { duration: 0.2 }
              }}
              className="fixed inset-y-0 right-0 w-[80%] sm:w-[70%] md:w-[50%] lg:w-[35%] bg-gradient-to-br from-black/95 to-restaurant-primary/90 z-[9999] flex flex-col justify-center items-center shadow-2xl overflow-y-auto overscroll-contain pointer-events-auto"
              style={{ willChange: "transform, opacity" }}
            >
              {/* Close button in top right */}
              <button 
                className="absolute top-5 right-5 flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 active:scale-95 hover:shadow-lg border border-white/20 backdrop-filter backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{ zIndex: 10000 }}
              >
                <X size={30} strokeWidth={2.5} className="text-white" />
              </button>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, staggerChildren: 0.1 }}
                className="w-full max-w-md px-6 sm:px-8 py-20 flex flex-col"
              >
                <nav className="flex flex-col space-y-8 text-center mb-14">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="overflow-hidden"
                    >
                      <Link 
                        href={link.href} 
                        className={`relative block text-white text-[1.3rem] sm:text-[1.4rem] font-heading font-medium tracking-wide hover:text-restaurant-secondary transition-all duration-300 ease-in-out group py-3 px-4 ${
                          location === link.href ? 'text-restaurant-secondary font-semibold' : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ pointerEvents: 'auto' }}
                      >
                        {link.label}
                        {/* Animated underline effect */}
                        <span 
                          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-restaurant-secondary transition-all duration-300 ease-in-out ${
                            location === link.href ? 'w-16' : 'group-hover:w-16'
                          }`}
                        />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                
                <div className="flex flex-col space-y-6 w-full mt-10">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button 
                      className="w-full bg-[#D72638] hover:bg-[#C02030] text-white py-7 rounded-xl text-[1.25rem] font-heading font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-[0.98]"
                      onClick={() => setMobileMenuOpen(false)}
                      asChild
                      style={{ pointerEvents: 'auto' }}
                    >
                      <Link href="/menu" className="flex items-center justify-center gap-3">
                        <Menu className="w-6 h-6" />
                        <span>Order Now</span>
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button 
                      className="w-full bg-white/10 hover:bg-white/15 text-white py-7 rounded-xl text-[1.25rem] border border-white/40 font-heading font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-[1.03] active:scale-[0.98] backdrop-blur-sm"
                      onClick={() => setMobileMenuOpen(false)}
                      asChild
                      style={{ pointerEvents: 'auto' }}
                    >
                      <Link href="/cart" className="flex items-center justify-center gap-3">
                        <ShoppingCart className="w-6 h-6" />
                        <span>View Cart</span>
                      </Link>
                    </Button>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-5"
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <a 
                      href="tel:+1234567890" 
                      className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 active:scale-95"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <Phone className="w-5 h-5 text-restaurant-secondary" strokeWidth={2.5} />
                      <span className="font-medium tracking-wide text-base">(123) 456-7890</span>
                    </a>
                    
                    <a 
                      href="/reservation" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white hover:text-restaurant-secondary transition-all duration-300 text-base hover:bg-white/5 rounded-full active:scale-95"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <CalendarDays className="w-5 h-5 text-restaurant-secondary" strokeWidth={2} />
                      <span className="font-medium">Reserve a Table</span>
                    </a>
                  </div>
                  
                  <p className="text-white/70 text-sm mt-1 font-medium tracking-wide">
                    Open 10:00 AM - 10:00 PM
                  </p>
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
