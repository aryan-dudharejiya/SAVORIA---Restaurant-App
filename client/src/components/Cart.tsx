import { X, ShoppingBag, Trash2, ShoppingCart, Gift, Clock, CreditCard, ChevronRight, Minus, Plus, PackageCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
    hidden: { opacity: 0, x: "100%" },
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
      x: "100%", 
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
      scale: 0.95,
      transition: { 
        duration: 0.2 
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <motion.div 
        className="relative z-10 w-full sm:w-[450px] h-full bg-white shadow-2xl flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="relative px-6 py-8 bg-gradient-to-r from-primary to-primary/80 text-white"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2.5 w-10 h-10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Your Cart</h3>
              <p className="text-white/80 text-sm mt-0.5">
                {cartItems.length === 0 
                  ? "Your cart is empty" 
                  : `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`}
              </p>
            </div>
          </div>
          
          {cartItems.length > 0 && (
            <div className="mt-6 pb-1">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                {subtotal >= 25 ? (
                  <div className="h-full bg-white w-full"></div>
                ) : (
                  <div className="h-full bg-white" style={{ width: `${(subtotal / 25) * 100}%` }}></div>
                )}
              </div>
              <p className="text-xs text-white/90 mt-2">
                {subtotal >= 25 
                  ? "You've got free delivery!" 
                  : `Add $${(25 - subtotal).toFixed(2)} more for free delivery`}
              </p>
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-gray-100 rounded-full p-7 mb-6">
              <ShoppingBag className="w-12 h-12 text-primary/60" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Your cart is empty</h4>
            <p className="text-gray-500 max-w-xs mb-8">
              Looks like you haven't added any delicious items to your cart yet. Our menu is waiting for you!
            </p>
            <Button 
              onClick={() => {
                navigate('/menu');
                onClose();
              }}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto rounded-full text-base"
            >
              Browse Our Menu
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 pb-0 border-b border-gray-100">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="mb-5 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                    variants={itemVariants}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-base pr-4">{item.name}</h4>
                      <p className="font-semibold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3 italic">
                      ${item.price.toFixed(2)} each
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50 shadow-sm">
                        <button 
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                          onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-gray-800">
                          {item.quantity}
                        </span>
                        <button 
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all focus:outline-none" 
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full text-sm py-5 h-auto ${promoApplied ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
                  onClick={() => setShowPromoInput(!showPromoInput)}
                >
                  <Gift size={16} className={`mr-2 ${promoApplied ? 'text-green-500' : 'text-primary'}`} />
                  {promoApplied ? "Promo Applied" : "Add Promo Code"}
                </Button>

                <AnimatePresence>
                  {showPromoInput && !promoApplied && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="flex gap-2 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          className="flex-1 px-4 py-3 text-gray-700 text-sm focus:outline-none border-0"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button
                          size="sm"
                          onClick={handlePromoCode}
                          className="bg-primary hover:bg-primary/90 text-white rounded-none py-0 h-auto px-5 rounded-r-lg"
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 pl-2">
                        Try using "savoria20" for 20% off your order
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {promoApplied && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between mt-3 px-4 py-3 bg-green-50 text-green-800 rounded-lg border border-green-100 shadow-sm"
                    >
                      <div className="flex items-center">
                        <Badge className="bg-green-100 text-green-800 mr-2 font-normal shadow-sm">20% OFF</Badge>
                        <span className="font-medium">{promoCode.toUpperCase()}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setPromoApplied(false);
                          setDiscount(0);
                          setPromoCode("");
                          setShowPromoInput(false);
                        }}
                        className="text-green-800 hover:text-green-900 rounded-full hover:bg-green-100 p-1.5 transition-colors"
                        aria-label="Remove promo code"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 text-base">Order Summary</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {subtotal >= 25 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                {promoApplied && (
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <span className="flex items-center">
                      <Gift size={14} className="mr-1.5" />
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
              
              <div className="space-y-3">
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 h-auto rounded-full flex items-center justify-center text-base"
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
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-6 h-auto rounded-full text-base"
                >
                  Continue Shopping
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
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
                  className="text-sm text-gray-500 hover:text-red-500 flex items-center transition-colors"
                >
                  <Trash2 size={14} className="mr-1.5" /> Clear cart
                </button>
                
                <div className="flex items-center text-sm text-gray-600">
                  <PackageCheck size={14} className="text-primary mr-1.5" />
                  <span>Free delivery over $25</span>
                </div>
              </div>
            </div>
            
            {/* Delivery Time Estimate */}
            <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-center gap-2 text-sm text-gray-700">
              <Clock size={14} className="text-primary" />
              <span>Estimated delivery: 30-45 minutes</span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;