import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import {
  checkoutFormSchema,
  type CartItem,
  type CheckoutFormData,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Load Stripe outside of component to avoid recreating it on every render
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : // Promise.reject(new Error("Missing Stripe public key"));

    function OrderSummary({ cartItems }: { cartItems: CartItem[] }) {
      const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      return (
        <Card className="w-full border-0 shadow-lg">
          <CardHeader className="bg-[#FFF7E6] rounded-t-lg">
            <CardTitle className="text-[#3D2C2E] text-2xl">
              Order Summary
            </CardTitle>
            <CardDescription>Review your order details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="max-h-72 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start py-3 border-b border-[#EFEFEF] gap-3 hover:bg-[#FFF7F0] rounded-md p-2 transition-colors"
                >
                  {item.image && (
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-[#3D2C2E]">
                      {item.name}
                    </p>
                    <p className="text-sm text-[#6B7280] mt-1">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-xs text-[#D72638] font-medium mt-1">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <p className="font-semibold shrink-0 text-[#D72638]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center font-bold text-xl pt-4 mt-2 border-t border-[#EFEFEF] text-[#3D2C2E]">
              <span>Total:</span>
              <span className="text-[#D72638]">${totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      );
    };

function PaymentForm({
  clientSecret,
  onPaymentSuccess,
}: {
  clientSecret: string;
  onPaymentSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description:
            error.message || "An error occurred during payment processing.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully!",
        });
        onPaymentSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
        <PaymentElement className="payment-element" />
      </div>
      <Button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="btn-form-primary w-full mt-6"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const [orderStep, setOrderStep] = useState<
    "details" | "payment" | "confirmation"
  >("details");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      deliveryAddress: "",
      notes: "",
      paymentMethod: "cod",
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (cartItems.length === 0 && orderStep === "details") {
      navigate("/menu");
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before checkout.",
      });
    }
  }, [cartItems, navigate, orderStep, toast]);

  // Handle submitting the customer details and creating the order
  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setPaymentMethod(data.paymentMethod);

      if (data.paymentMethod === "upi") {
        // Create payment intent with Stripe for UPI payment
        const paymentResponse = await apiRequest(
          "POST",
          "/api/create-payment-intent",
          {
            amount: totalAmount,
          }
        );

        if (!paymentResponse.ok) {
          throw new Error("Failed to create payment intent");
        }

        const paymentData = await paymentResponse.json();
        setClientSecret(paymentData.clientSecret);
        setOrderStep("payment");
      } else {
        // For COD, create order directly
        await createOrder(data);
      }
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "An error occurred during checkout.",
        variant: "destructive",
      });
    }
  };

  const createOrder = async (data: CheckoutFormData) => {
    try {
      const orderResponse = await apiRequest("POST", "/api/orders", {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        deliveryAddress: data.deliveryAddress,
        notes: data.notes || "",
        paymentMethod: data.paymentMethod,
        items: cartItems,
        totalAmount: totalAmount.toString(),
        paymentStatus: data.paymentMethod === "cod" ? "pending" : "completed",
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();
      setOrderId(orderData.trackingId);
      clearCart();
      setOrderStep("confirmation");
    } catch (error: any) {
      toast({
        title: "Order Error",
        description:
          error.message || "An error occurred while placing your order.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = async () => {
    const data = form.getValues();
    await createOrder(data);
  };

  if (orderStep === "confirmation") {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-lg mx-auto border-0 shadow-lg">
          <CardHeader className="bg-[#FFF7E6] rounded-t-lg">
            <CardTitle className="text-center text-[#D72638] text-2xl">
              Order Placed Successfully!
            </CardTitle>
            <CardDescription className="text-center">
              Thank you for your order.
            </CardDescription>
          </CardHeader>
          <CardContent className="form-container p-8 space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D72638] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="font-medium text-[#3D2C2E] text-lg">
                Your order has been confirmed.
              </p>
              <p className="mt-2 bg-[#FFF3E3] inline-block px-4 py-2 rounded-full">
                Order Tracking ID:{" "}
                <span className="font-bold text-[#D72638]">{orderId}</span>
              </p>

              {/* Order thumbnail images */}
              <div className="flex justify-center my-6">
                <div className="flex -space-x-4 overflow-hidden">
                  {cartItems.slice(0, 3).map((item, index) =>
                    item.image ? (
                      <div
                        key={index}
                        className="inline-block h-16 w-16 rounded-full border-2 border-white overflow-hidden shadow-md"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : null
                  )}
                  {cartItems.length > 3 && (
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-[#FFF3E3] text-sm font-medium text-[#D72638] shadow-md">
                      +{cartItems.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm mt-4 text-[#3D2C2E]">
                You can track your order status using this tracking ID.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 p-6 bg-[#FAFAFA] rounded-b-lg border-t border-[#EFEFEF]">
            <Button
              className="btn-form-primary w-full"
              onClick={() => navigate(`/track-order/${orderId}`)}
            >
              Track Order
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-[#FFF3E3] hover:text-[#D72638] transition-colors"
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {orderStep === "details" ? (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-[#FFF7E6] rounded-t-lg">
                <CardTitle className="text-[#3D2C2E] text-2xl">
                  Delivery Details
                </CardTitle>
                <CardDescription>
                  Fill in your delivery information
                </CardDescription>
              </CardHeader>
              <CardContent className="form-container p-8 rounded-b-lg">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="form-field-group">
                          <FormLabel className="form-label">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              className="form-input"
                            />
                          </FormControl>
                          <FormMessage className="form-error" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="form-field-group">
                          <FormLabel className="form-label">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your phone number"
                              {...field}
                              className="form-input"
                            />
                          </FormControl>
                          <FormMessage className="form-error" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem className="form-field-group">
                          <FormLabel className="form-label">
                            Delivery Address
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your full delivery address"
                              className="form-textarea"
                              rows={3}
                              onChange={field.onChange}
                              value={field.value}
                              name={field.name}
                              onBlur={field.onBlur}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage className="form-error" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="form-field-group">
                          <FormLabel className="form-label">
                            Order Notes (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special instructions for your order?"
                              className="form-textarea"
                              rows={2}
                              onChange={field.onChange}
                              value={field.value}
                              name={field.name}
                              onBlur={field.onBlur}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage className="form-error" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3 form-field-group">
                          <FormLabel className="form-label">
                            Payment Method
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-3 bg-white p-3 rounded-md border border-[#D1D5DB] hover:border-[#D72638] transition-colors">
                                <RadioGroupItem
                                  value="cod"
                                  id="cod"
                                  className="form-radio w-5 h-5"
                                />
                                <Label
                                  htmlFor="cod"
                                  className="cursor-pointer font-medium text-[#3D2C2E]"
                                >
                                  Cash on Delivery
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 bg-white p-3 rounded-md border border-[#D1D5DB] hover:border-[#D72638] transition-colors">
                                <RadioGroupItem
                                  value="upi"
                                  id="upi"
                                  className="form-radio w-5 h-5"
                                />
                                <Label
                                  htmlFor="upi"
                                  className="cursor-pointer font-medium text-[#3D2C2E]"
                                >
                                  UPI/Card Payment
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="form-error" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="btn-form-primary w-full mt-4"
                      disabled={isSubmitting || cartItems.length === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Processing...
                        </>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : orderStep === "payment" && clientSecret ? (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-[#FFF7E6] rounded-t-lg">
                <CardTitle className="text-[#3D2C2E] text-2xl">
                  Payment
                </CardTitle>
                <CardDescription>
                  Complete your payment securely
                </CardDescription>
              </CardHeader>
              <CardContent className="form-container p-8 rounded-b-lg">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    clientSecret={clientSecret}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </CardContent>
              <CardFooter className="p-4 bg-[#FAFAFA] rounded-b-lg border-t border-[#EFEFEF]">
                <Button
                  variant="outline"
                  className="w-full hover:bg-[#FFF3E3] hover:text-[#D72638] transition-colors"
                  onClick={() => setOrderStep("details")}
                >
                  Back to Details
                </Button>
              </CardFooter>
            </Card>
          ) : null}
        </div>

        <div>
          <OrderSummary cartItems={cartItems} />
        </div>
      </div>
    </div>
  );
}
