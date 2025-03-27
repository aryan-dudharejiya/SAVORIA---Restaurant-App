import { X, ShoppingBag, Trash2, ShoppingCart, Gift, Clock, CreditCard, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface CartProps {
  onClose: () => void;
}

const Cart = ({ onClose }: CartProps) => {
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showPromoInput, setShowPromoInput] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const deliveryFee = subtotal > 0 ? 2.99 : 0;
  const totalBeforeDiscount = subtotal + deliveryFee;
  const totalPrice = totalBeforeDiscount - discount;

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === "savoria20") {
      const discountAmount = subtotal * 0.2;
      setDiscount(discountAmount);
      setPromoApplied(true);
      toast({
        title: "Promo code applied!",
        description: "You got 20% off your order.",
        variant: "default",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart first.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to checkout page
    navigate('/checkout');
    onClose();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07
      }
    },
    exit: { 
      opacity: 0, 
      x: 300, 
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <motion.div 
      className="fixed right-0 top-0 h-full w-full z-50"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backdropVariants}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <motion.div 
        className="absolute right-0 top-0 h-full w-full sm:w-auto sm:min-w-[400px] max-w-md bg-white shadow-2xl"
        variants={containerVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-primary text-white p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Your Cart</h3>
                  <p className="text-white/80 text-sm">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow px-6 py-12">
              <div className="bg-gray-100/70 rounded-full p-6 mb-6">
                <ShoppingBag className="w-12 h-12 text-primary/60" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h4>
              <p className="text-gray-500 text-center max-w-xs mb-8">
                Looks like you haven't added any delicious items to your cart yet.
              </p>
              <Button 
                onClick={() => {
                  navigate('/menu');
                  onClose();
                }}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full"
              >
                Browse Our Menu
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-grow overflow-y-auto p-4 sm:p-6 border-b border-gray-100">
                <AnimatePresence>
                  <motion.div>
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id} 
                        className="flex gap-4 py-4 border-b border-gray-100 last:border-0"
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="font-semibold text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            ${item.price.toFixed(2)} each
                          </p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
                              <button 
                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium text-gray-800">
                                {item.quantity}
                              </span>
                              <button 
                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            
                            <button 
                              className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all" 
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full text-sm"
                      onClick={() => setShowPromoInput(!showPromoInput)}
                    >
                      <Gift size={14} className="mr-2 text-primary" />
                      {promoApplied ? "Promo Applied" : "Add Promo Code"}
                    </Button>
                  </div>

                  {showPromoInput && !promoApplied && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex gap-2 mt-2"
                    >
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button
                        size="sm"
                        onClick={handlePromoCode}
                        className="bg-primary hover:bg-primary/90 text-white rounded-r-md"
                      >
                        Apply
                      </Button>
                    </motion.div>
                  )}

                  {promoApplied && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between mt-2 px-3 py-2 bg-green-50 text-green-800 rounded-md text-sm"
                    >
                      <div className="flex items-center">
                        <Badge className="bg-green-100 text-green-800 mr-2 font-normal">20% OFF</Badge>
                        <span>{promoCode.toUpperCase()}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setPromoApplied(false);
                          setDiscount(0);
                          setPromoCode("");
                        }}
                        className="text-green-800 hover:text-green-900"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 sm:p-6 bg-gray-50">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Order Summary</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                    </div>
                    
                    {promoApplied && (
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span className="flex items-center">
                          <Gift size={14} className="mr-1" />
                          Discount (20%)
                        </span>
                        <span className="font-medium">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-gray-800">Total</span>
                        <span className="text-primary text-lg">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-full flex items-center justify-center"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigate('/menu');
                      onClose();
                    }}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
                
                <div className="mt-6 flex items-center justify-center">
                  <button 
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your cart?")) {
                        clearCart();
                        toast({
                          title: "Cart cleared",
                          description: "All items have been removed from your cart.",
                        });
                      }
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <Trash2 size={12} className="mr-1" /> Clear cart
                  </button>
                </div>
              </div>
              
              {/* Delivery Time Estimate */}
              <div className="p-4 border-t border-gray-200 bg-white/95 flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock size={14} className="text-primary" />
                <span>Estimated delivery time: 30-45 minutes</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Cart;
