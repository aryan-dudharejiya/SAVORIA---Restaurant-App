import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();

  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/reservation", label: "Reservation" },
    { href: "/track-order", label: "Track Order" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage
          ? scrolled
            ? "bg-white shadow-md py-2"
            : "bg-transparent py-4"
          : "bg-white shadow-md py-2"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-primary">
          <span
            className={`font-primary transition-colors duration-300 text-restaurant-primary drop-shadow-sm`}
          >
            SAVORIA
          </span>
        </Link>

        <nav className="hidden lg:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-primary font-medium uppercase tracking-wide transition ${
                location === link.href
                  ? "text-primary font-semibold"
                  : isHomePage
                  ? scrolled
                    ? "text-gray-800 hover:text-primary"
                    : "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-600"
              } after:block after:content-[''] after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/cart"
            className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <ShoppingCart className="w-5 h-5 text-gray-800" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          <button
            className="lg:hidden p-2 rounded-md transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <Menu
                className={`w-6 h-6 ${
                  isHomePage && !scrolled ? "text-white" : "text-black"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-4/5 sm:w-2/3 h-full bg-white shadow-xl z-50 flex flex-col p-6"
          >
            <button
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>

            <nav className="mt-16 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-lg font-primary font-medium text-gray-800 hover:text-primary py-2 after:block after:content-[''] after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button
              className="mt-auto w-full bg-primary text-white py-4 rounded-md text-lg font-primary font-semibold shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
              asChild
            >
              <Link href="/cart">View Cart</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
