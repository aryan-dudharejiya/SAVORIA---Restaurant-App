import { X, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

interface CartProps {
  onClose: () => void;
}

const Cart = ({ onClose }: CartProps) => {
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <motion.div 
      className="fixed right-0 top-0 h-full w-full z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      <motion.div 
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl p-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5 pb-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-xl">Your Cart</h3>
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
              {cartItems.length} items
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh]">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium mb-2">Your cart is empty</p>
            <p className="text-gray-400 text-sm text-center max-w-xs mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button 
              onClick={() => {
                navigate('/menu');
                onClose();
              }}
              variant="outline"
              className="rounded-md"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto max-h-[60vh] pr-2 -mr-2">
              <motion.div variants={containerVariants}>
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="flex gap-3 py-3 border-b"
                    variants={itemVariants}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.name}</p>
                        <p className="font-semibold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        ${item.price.toFixed(2)} each
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border rounded-md">
                          <button 
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                          <button 
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors" 
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
            </div>

            <div className="border-t pt-4 mt-auto sticky bottom-0 bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">$0.00</span>
              </div>
              
              <div className="flex justify-between items-center mb-6 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-md py-6 text-base font-medium"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Cart;
