import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  ShoppingBag, 
  Trash2, 
  ChevronRight, 
  Minus, 
  Plus, 
  CreditCard, 
  Truck, 
  Home, 
  GalleryVerticalEnd, 
  ArrowRight,
  ShoppingCart,
  Banknote,
  QrCode,
  Clock,
  ShieldCheck,
  ChevronLeft,
  RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

// Main cart page component
const Cart = () => {
  const [, navigate] = useLocation();
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showPromoInput, setShowPromoInput] = useState(false);
  
  // Constants
  const FREE_DELIVERY_THRESHOLD = 25;
  const TAX_RATE = 0.05; // 5% tax
  
  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 2.99;
  const taxAmount = subtotal * TAX_RATE;
  const totalBeforeDiscount = subtotal + deliveryFee + taxAmount;
  const totalPrice = totalBeforeDiscount - discount;
  
  // Progress calculation for free delivery
  const progressPercentage = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  // Handle promo code
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

  // Handle checkout
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
  };

  // Animation variants
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

  // Page header animation
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Empty state animation
  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 min-h-[80vh]">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-6 overflow-x-auto">
        <Link href="/" className="hover:text-primary transition-colors">
          <span className="flex items-center">
            <Home size={14} className="mr-1" /> Home
          </span>
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <Link href="/menu" className="hover:text-primary transition-colors">
          <span className="flex items-center">
            <GalleryVerticalEnd size={14} className="mr-1" /> Menu
          </span>
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-primary font-medium flex items-center">
          <ShoppingCart size={14} className="mr-1" /> Cart
        </span>
      </nav>

      {/* Page Header */}
      <motion.div 
        className="mb-10 text-center md:text-left"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Your Shopping Cart</h1>
        <p className="text-gray-600 max-w-xl">
          Review your items, update quantities, or proceed to checkout to complete your order.
        </p>
      </motion.div>

      {cartItems.length === 0 ? (
        // Empty Cart State
        <motion.div 
          className="flex flex-col items-center justify-center py-16 text-center"
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-gray-100/80 rounded-full p-8 mb-6 shadow-inner">
            <ShoppingBag className="w-20 h-20 text-primary/70" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 max-w-md mb-8 text-lg">
            Looks like you haven't added any delicious items to your cart yet. Our menu is waiting for you!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/menu')}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto rounded-full text-lg shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Browse Our Menu
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 h-auto rounded-full text-lg"
            >
              Return to Home
            </Button>
          </div>
        </motion.div>
      ) : (
        // Cart with Items
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2">
            {/* Free delivery progress bar */}
            <div className="bg-white p-4 mb-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-sm text-gray-700 mt-3 font-medium flex items-center">
                {subtotal >= FREE_DELIVERY_THRESHOLD ? (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-green-500" />
                    <span className="text-green-600">Congratulations! You've qualified for free delivery 🎉</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 mr-1.5 text-primary" />
                    <span>Add ${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} more for free delivery</span>
                  </>
                )}
              </p>
            </div>

            {/* Items List Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/80">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Cart Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})
                  </h2>
                  <button 
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your cart?")) {
                        clearCart();
                        toast({
                          title: "Cart cleared",
                          description: "All items have been removed from your cart.",
                          variant: "default",
                        });
                      }
                    }}
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center transition-colors"
                  >
                    <RefreshCcw size={14} className="mr-1.5" /> Clear cart
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="p-5 flex flex-col sm:flex-row gap-4 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Item Image */}
                      {item.image && (
                        <div className="w-full sm:w-32 h-32 flex-shrink-0 mx-auto sm:mx-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover rounded-lg shadow-sm"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      {/* Item Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900 text-lg">{item.name}</h3>
                            {/* Item description would go here if available in the schema */}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary text-lg">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-auto flex flex-wrap justify-between items-center gap-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white shadow-sm">
                            <button 
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                              onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-1 text-base font-medium text-gray-800">
                              {item.quantity}
                            </span>
                            <button 
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button 
                            className="text-gray-500 hover:text-red-500 flex items-center gap-1 hover:bg-red-50 p-2 rounded-full transition-all focus:outline-none" 
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Continue Shopping Link */}
            <div className="mt-6">
              <Link href="/menu" className="inline-flex items-center text-primary hover:underline font-medium">
                <ChevronLeft size={16} className="mr-1" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-5 border-b border-gray-100 bg-gray-50/80">
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
              </div>
              
              <div className="p-5">
                {/* Promo Code Section */}
                <div className="mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full text-sm py-5 h-auto ${promoApplied ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
                    onClick={() => setShowPromoInput(!showPromoInput)}
                  >
                    {promoApplied ? "Promo Applied" : "Add Promo Code"}
                  </Button>

                  <AnimatePresence>
                    {showPromoInput && !promoApplied && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200">
                          <input
                            type="text"
                            placeholder="Enter promo code"
                            className="flex-1 rounded-lg border-0 bg-[#FFF3E3] px-4 py-3 min-h-[50px] text-[#3D2C2E] text-sm
                            placeholder:text-[#9CA3AF] placeholder:font-normal focus:outline-none focus:shadow-[0_0_5px_rgba(215,38,56,0.4)]
                            transition-all duration-300"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handlePromoCode();
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={handlePromoCode}
                            className="bg-primary hover:bg-primary/90 text-white rounded-none py-0 h-auto px-5"
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
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Taxes (5%)</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {subtotal >= FREE_DELIVERY_THRESHOLD ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <span className="flex items-center">
                        Discount (20%)
                      </span>
                      <span className="font-medium">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-semibold">Total</span>
                      <span className="text-primary text-2xl font-bold">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <div className="space-y-4">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 h-auto rounded-full flex items-center justify-center text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </div>
                </div>

                {/* Accepted Payment Methods */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Accepted Payment Methods</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 py-1.5 px-3 bg-gray-50">
                      <CreditCard size={14} />
                      <span>Credit Card</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 py-1.5 px-3 bg-gray-50">
                      <QrCode size={14} />
                      <span>UPI</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 py-1.5 px-3 bg-gray-50">
                      <Banknote size={14} />
                      <span>Cash on Delivery</span>
                    </Badge>
                  </div>
                </div>

                {/* Estimated Delivery Time */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <Clock size={16} className="text-primary" />
                  <span>Estimated delivery: 30-45 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;