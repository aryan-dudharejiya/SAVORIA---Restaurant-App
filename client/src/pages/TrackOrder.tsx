import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, Clock, Truck, Package, ChefHat, Search } from "lucide-react";
import { type Order } from "@shared/schema";

function OrderStatusProgressBar({ status }: { status: string }) {
  const statuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
  const currentStep = statuses.indexOf(status);
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Order Placed";
      case "confirmed": return "Confirmed";
      case "preparing": return "Preparing";
      case "out_for_delivery": return "Out for Delivery";
      case "delivered": return "Delivered";
      default: return status;
    }
  };
  
  const getStatusIcon = (status: string, isActive: boolean) => {
    const className = `h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground"}`;
    
    switch (status) {
      case "pending": return <Clock className={className} />;
      case "confirmed": return <Check className={className} />;
      case "preparing": return <ChefHat className={className} />;
      case "out_for_delivery": return <Truck className={className} />;
      case "delivered": return <Package className={className} />;
      default: return <Clock className={className} />;
    }
  };
  
  return (
    <div className="w-full py-4">
      <div className="flex justify-between mb-2">
        {statuses.map((step, index) => (
          <div key={step} className="flex flex-col items-center text-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center mb-1
              ${index <= currentStep ? "bg-primary/20" : "bg-muted"}
            `}>
              {getStatusIcon(step, index <= currentStep)}
            </div>
            <p className={`text-xs font-medium whitespace-nowrap ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
              {getStatusLabel(step)}
            </p>
          </div>
        ))}
      </div>
      
      <div className="relative w-full h-2 bg-muted rounded-full mt-2">
        <div 
          className="absolute h-2 bg-primary rounded-full transition-all duration-500"
          style={{ 
            width: `${Math.max(0, (currentStep / (statuses.length - 1)) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

function OrderDetails({ order }: { order: Order }) {
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date';
  const orderTime = order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'Unknown time';
  const items = Array.isArray(order.items) ? order.items : [];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order #{order.trackingId}</CardTitle>
        <CardDescription>Placed on {orderDate} at {orderTime}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OrderStatusProgressBar status={order.status} />
        
        <div className="space-y-4 mt-6">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Delivery Details</h3>
            <p className="font-medium">{order.fullName}</p>
            <p>{order.phoneNumber}</p>
            <p className="whitespace-pre-line">{order.deliveryAddress}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Order Items</h3>
            <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
              {items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total:</span>
            <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Payment Method</h3>
            <p className="capitalize">{order.paymentMethod}</p>
            <p className="text-xs text-muted-foreground capitalize">Status: {order.paymentStatus}</p>
          </div>
          
          {order.estimatedDeliveryTime && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Estimated Delivery</h3>
              <p>Today, approximately by {order.estimatedDeliveryTime}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OrderTracker() {
  const params = useParams<{ trackingId: string }>();
  const trackingId = params?.trackingId;
  
  const { isLoading, error, data: order } = useQuery({
    queryKey: ['/api/orders/tracking', trackingId],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/orders/tracking/${trackingId}`);
      if (!res.ok) {
        throw new Error('Order not found');
      }
      return res.json();
    },
    enabled: !!trackingId
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
          <Button variant="outline" onClick={() => window.location.href = '/'}>Return Home</Button>
        </div>
      </div>
    );
  }
  
  return order ? <OrderDetails order={order} /> : null;
}

function TrackOrderForm() {
  const [trackingId, setTrackingId] = useState('');
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
    
    navigate(`/track-order/${trackingId}`);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Track Your Order</CardTitle>
        <CardDescription>Enter your order tracking ID below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="trackingId" className="text-sm font-medium">
              Tracking ID
            </label>
            <div className="flex gap-2">
              <Input
                id="trackingId"
                placeholder="e.g. SAV-1234-ABC"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Track</Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>The tracking ID can be found in your order confirmation email or SMS.</p>
      </CardFooter>
    </Card>
  );
}

export default function TrackOrder() {
  const params = useParams<{ trackingId: string }>();
  const trackingId = params?.trackingId;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Track Order</h1>
      
      <div className="max-w-3xl mx-auto">
        {trackingId ? <OrderTracker /> : <TrackOrderForm />}
      </div>
    </div>
  );
}