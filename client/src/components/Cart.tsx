import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface CartProps {
  onClose: () => void;
}

const Cart = ({ onClose }: CartProps) => {
  const { cartItems, removeFromCart } = useCart();
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

  return (
    <div className="absolute right-4 mt-2 w-72 bg-white rounded-lg shadow-xl p-4 z-50">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <h3 className="font-bold text-lg">Your Cart</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close cart"
        >
          <X size={18} />
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-center py-4 text-gray-500">Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <button 
                className="text-red-500" 
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex justify-between font-bold">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      <Button 
        onClick={handleCheckout}
        className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md"
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default Cart;
