import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Check,
  Clock,
  Truck,
  Package,
  ChefHat,
  Search,
  MapPin,
  Utensils,
  CreditCard,
  ArrowRight,
  Coffee,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Order } from "@shared/schema";

function OrderStatusProgressBar({ status }: { status: string }) {
  const statuses = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
  ];
  const currentStep = statuses.indexOf(status);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Placed";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string, isActive: boolean) => {
    const fillClass = isActive ? "text-primary" : "text-muted-foreground";
    const className = `h-8 w-8 ${fillClass}`;
    const animationClass =
      isActive && status === "out_for_delivery" ? "animate-bounce" : "";

    switch (status) {
      case "pending":
        return (
          <div
            className={`${animationClass} rounded-full bg-gray-100 p-2 shadow-sm`}
          >
            <Clock className={className} />
          </div>
        );
      case "confirmed":
        return (
          <div
            className={`${animationClass} rounded-full bg-green-100 p-2 shadow-sm`}
          >
            <Check
              className={`${className} ${isActive ? "text-green-600" : ""}`}
            />
          </div>
        );
      case "preparing":
        return (
          <div
            className={`${animationClass} rounded-full bg-yellow-100 p-2 shadow-sm`}
          >
            <ChefHat
              className={`${className} ${isActive ? "text-yellow-600" : ""}`}
            />
          </div>
        );
      case "out_for_delivery":
        return (
          <div
            className={`${animationClass} rounded-full bg-blue-100 p-2 shadow-sm`}
          >
            <Truck
              className={`${className} ${isActive ? "text-blue-600" : ""}`}
            />
          </div>
        );
      case "delivered":
        return (
          <div
            className={`${animationClass} rounded-full bg-primary/10 p-2 shadow-sm`}
          >
            <Package className={className} />
          </div>
        );
      default:
        return (
          <div
            className={`${animationClass} rounded-full bg-gray-100 p-2 shadow-sm`}
          >
            <Clock className={className} />
          </div>
        );
    }
  };

  return (
    <div className="w-full py-4">
      <div className="flex justify-between mb-2">
        {statuses.map((step, index) => (
          <div key={step} className="flex flex-col items-center text-center">
            <div
              className={`
              w-10 h-10 rounded-full flex items-center justify-center mb-1
              ${index <= currentStep ? "bg-primary/20" : "bg-muted"}
            `}
            >
              {getStatusIcon(step, index <= currentStep)}
            </div>
            <p
              className={`text-xs font-medium whitespace-nowrap ${
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {getStatusLabel(step)}
            </p>
          </div>
        ))}
      </div>

      <div className="relative w-full h-2 bg-muted rounded-full mt-2">
        <div
          className="absolute h-2 bg-primary rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(
              0,
              (currentStep / (statuses.length - 1)) * 100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function OrderDetails({ order }: { order: Order }) {
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "Unknown date";
  const orderTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString()
    : "Unknown time";
  const items = Array.isArray(order.items) ? order.items : [];

  // Status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-indigo-100 text-indigo-800";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Payment badge color
  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate estimated delivery time if not provided
  const defaultDeliveryTime = () => {
    const now = new Date();
    const hours = now.getHours() + 1;
    const minutes = now.getMinutes();
    return `${hours % 12 || 12}:${minutes < 10 ? "0" + minutes : minutes} ${
      hours >= 12 ? "PM" : "AM"
    }`;
  };

  const estimatedDelivery =
    order.estimatedDeliveryTime || defaultDeliveryTime();

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              Order #{order.trackingId}
              <Badge className={getStatusBadgeColor(order.status)}>
                {order.status === "out_for_delivery"
                  ? "Out for Delivery"
                  : order.status.charAt(0).toUpperCase() +
                    order.status.slice(1)}
              </Badge>
            </CardTitle>
            <CardDescription>
              Placed on {orderDate} at {orderTime}
            </CardDescription>
          </div>
          {order.status === "out_for_delivery" && (
            <div className="bg-primary/10 text-primary rounded-lg p-3 flex flex-col items-center">
              <Clock className="h-6 w-6" />
              <span className="text-xs font-medium mt-1">Arriving Soon</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <OrderStatusProgressBar status={order.status} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Delivery Details</h3>
              </div>
              <p className="font-medium">{order.fullName}</p>
              <p>{order.phoneNumber}</p>
              <p className="whitespace-pre-line">{order.deliveryAddress}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Payment Information</h3>
              </div>
              <div className="flex items-center justify-between">
                <p className="capitalize flex items-center">
                  {order.paymentMethod === "card" ? (
                    <CreditCard className="h-4 w-4 mr-1 inline" />
                  ) : (
                    <Coffee className="h-4 w-4 mr-1 inline" />
                  )}
                  {order.paymentMethod}
                </p>
                <Badge className={getPaymentBadgeColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Delivery Information</h3>
              </div>
              <div className="flex justify-between items-center">
                <p>Estimated Time:</p>
                <p className="font-medium">{estimatedDelivery}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Order Items</h3>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-start border-b pb-3 gap-3"
                  >
                    {item.image && (
                      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">
                          {item.quantity}
                        </span>
                        <span className="font-medium truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} each
                      </span>
                    </div>
                    <span className="font-medium shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-2 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span>Subtotal</span>
                  <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span>Delivery Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between items-center font-bold mt-2 pt-2 border-t text-primary">
                  <span>Total</span>
                  <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <MapPin className="mr-2 h-4 w-4" /> Track Delivery
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderTracker() {
  const params = useParams<{ trackingId: string }>();
  const trackingId = params?.trackingId;

  const {
    isLoading,
    error,
    data: order,
  } = useQuery({
    queryKey: ["/api/orders/tracking", trackingId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/orders/tracking/${trackingId}`);
      if (!res.ok) {
        throw new Error("Order not found");
      }
      return res.json();
    },
    enabled: !!trackingId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-red-500">
          <Search className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">
          We couldn't find an order with tracking ID: {trackingId}
        </p>
        <div className="flex gap-4">
          <Button onClick={() => window.history.back()}>Go Back</Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return order ? <OrderDetails order={order} /> : null;
}

function TrackOrderForm() {
  const [trackingId, setTrackingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingId.trim()) {
      toast({
        title: "Tracking ID Required",
        description: "Please enter a valid tracking ID to track your order.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate a small delay to show loading state
    setTimeout(() => {
      navigate(`/track-order/${trackingId}`);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80"
            alt="Order Tracking"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
            loading="lazy"
          />
        </div>

        <Card className="w-full shadow-lg border-0">
          <CardHeader className="text-center border-b pb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Track Your Order</CardTitle>
            <CardDescription>
              Enter your order tracking ID to check delivery status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="trackingId" className="text-sm font-medium">
                    Tracking ID
                  </label>
                </div>
                <Input
                  id="trackingId"
                  placeholder="e.g. SAV-1234-ABC"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="rounded-lg border border-[#D1D5DB] border-[1.5px] bg-[#FFF3E3] px-4 py-3 h-12 text-[#3D2C2E] text-base
                  shadow-[0_2px_4px_rgba(0,0,0,0.05)] focus:border-[#D72638] focus:outline-none focus:shadow-[0_0_5px_rgba(215,38,56,0.4)]
                  hover:border-[#D72638]/50 placeholder:text-[#9CA3AF] placeholder:font-normal transition-all duration-300"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Locating your order...
                  </>
                ) : (
                  <>
                    Track Order <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  The tracking ID can be found in your order confirmation email
                  or SMS. If you've lost your tracking ID, you can also check
                  your order history in{" "}
                  <a href="/my-orders" className="underline font-medium">
                    My Orders
                  </a>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 pt-8 border-t grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium mb-2">Real-time Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Track your order's status in real-time with accurate updates
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium mb-2">Delivery Alerts</h3>
          <p className="text-sm text-muted-foreground">
            Receive notifications as your order progresses through each stage
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium mb-2">Location Updates</h3>
          <p className="text-sm text-muted-foreground">
            Know exactly where your delivery is and when it will arrive
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrder() {
  const params = useParams<{ trackingId: string }>();
  const trackingId = params?.trackingId;

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center font-heading">
        Track Your Order
      </h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Stay updated with your order's journey from our kitchen to your doorstep
      </p>

      {trackingId ? <OrderTracker /> : <TrackOrderForm />}
    </div>
  );
}
