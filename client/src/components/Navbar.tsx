import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../contexts/CartContext";
import Cart from "./Cart";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        scrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            <span className="font-heading text-2xl font-bold text-white drop-shadow-md">
              SAVORIA
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`text-white font-medium text-sm uppercase tracking-wide hover:text-primary/90 transition-colors drop-shadow-md ${
                  location === link.href ? 'text-primary' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-6">
            {/* Cart Button */}
            <button 
              className="relative text-white"
              onClick={() => setCartOpen(!cartOpen)}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 drop-shadow-md" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
            
            {/* CTA Button */}
            <Button 
              className="hidden md:flex bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-md"
              asChild
            >
              <Link href="/menu">
                Order Now
              </Link>
            </Button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white z-10" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-40 flex flex-col justify-center items-center">
          <div className="w-full max-w-md px-6">
            <nav className="flex flex-col space-y-6 text-center mb-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`text-white text-2xl font-medium hover:text-primary transition-colors ${
                    location === link.href ? 'text-primary' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full text-lg"
              onClick={() => setMobileMenuOpen(false)}
              asChild
            >
              <Link href="/menu">
                Order Now
              </Link>
            </Button>
          </div>
        </div>
      )}
      
      {/* Cart Dropdown */}
      {cartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </header>
  );
};

export default Navbar;
