import { useState } from "react";
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

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setCartOpen(false);
  };

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
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="font-heading text-2xl font-bold text-primary">
              Savoria
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`nav-link font-medium ${location === link.href ? 'text-primary' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button 
              className="relative p-2"
              onClick={toggleCart}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="text-primary" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            
            <Button 
              variant="default" 
              className="hidden md:block bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full"
              asChild
            >
              <Link href="/menu">
                Order Now
              </Link>
            </Button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-primary" 
              onClick={toggleMobileMenu}
              aria-label="Mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="block py-2 border-b border-gray-200"
                onClick={closeMenus}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              <Button 
                className="w-full bg-primary text-white py-2 rounded-full"
                onClick={closeMenus}
                asChild
              >
                <Link href="/menu">
                  Order Now
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Cart Dropdown */}
      {cartOpen && <Cart onClose={() => setCartOpen(false)} />}

      <style>{`
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: #D84315;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
