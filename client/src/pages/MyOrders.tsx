import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Receipt, Clock, Check, ChefHat, Truck, Package } from "lucide-react";
import { type Order } from "@shared/schema";

function OrderStatusBadge({ status }: { status: string }) {
  let color = "";
  let icon = null;
  
  switch (status) {
    case "pending":
      color = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case "confirmed":
      color = "bg-blue-100 text-blue-800 hover:bg-blue-100";
      icon = <Check className="h-3 w-3 mr-1" />;
      break;
    case "preparing":
      color = "bg-orange-100 text-orange-800 hover:bg-orange-100";
      icon = <ChefHat className="h-3 w-3 mr-1" />;
      break;
    case "out_for_delivery":
      color = "bg-purple-100 text-purple-800 hover:bg-purple-100";
      icon = <Truck className="h-3 w-3 mr-1" />;
      break;
    case "delivered":
      color = "bg-green-100 text-green-800 hover:bg-green-100";
      icon = <Package className="h-3 w-3 mr-1" />;
      break;
    default:
      color = "bg-gray-100 text-gray-800 hover:bg-gray-100";
      icon = <Clock className="h-3 w-3 mr-1" />;
  }
  
  return (
    <Badge className={`flex items-center capitalize ${color}`} variant="outline">
      {icon}
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [, navigate] = useLocation();
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date';
  const items = Array.isArray(order.items) ? order.items : [];
  const itemCount = items.length;
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">Order #{order.trackingId}</CardTitle>
            <CardDescription>{orderDate}</CardDescription>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm">
          <p className="font-medium">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          <p className="text-muted-foreground line-clamp-1">
            {items.map((item: any) => item.name).join(', ')}
          </p>
        </div>
        <div className="mt-2">
          <p className="font-bold">Total: ${parseFloat(order.totalAmount).toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate(`/track-order/${order.trackingId}`)}
        >
          Track Order
        </Button>
      </CardFooter>
    </Card>
  );
}

function PhoneNumberForm({ onSubmit }: { onSubmit: (phoneNumber: string) => void }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to view your orders.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    onSubmit(phoneNumber);
    setIsSubmitting(false);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Find Your Orders</CardTitle>
        <CardDescription>Enter the phone number you used for your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </label>
            <div className="flex gap-2">
              <Input
                id="phoneNumber"
                placeholder="e.g. 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Find Orders"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function MyOrders() {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { isLoading, error, data: orders } = useQuery({
    queryKey: ['/api/orders/phone', phoneNumber],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/orders/phone/${phoneNumber}`);
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      return res.json();
    },
    enabled: !!phoneNumber
  });
  
  const handleSearchOrders = (phone: string) => {
    setPhoneNumber(phone);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
        
        {!phoneNumber ? (
          <PhoneNumberForm onSubmit={handleSearchOrders} />
        ) : (
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 text-red-500">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h2 className="text-xl font-bold mb-2">Couldn't Load Orders</h2>
                <p className="text-muted-foreground mb-4">
                  We encountered an error while loading your orders. Please try again.
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => setPhoneNumber(null)}>Try Again</Button>
                </div>
              </div>
            ) : orders?.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Your Order History</h2>
                  <Button variant="outline" onClick={() => setPhoneNumber(null)}>
                    Change Phone Number
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.map((order: Order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto" />
                </div>
                <h2 className="text-xl font-bold mb-2">No Orders Found</h2>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any orders associated with the phone number: {phoneNumber}
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => setPhoneNumber(null)}>Try Another Number</Button>
                  <Button variant="outline" onClick={() => window.location.href = '/menu'}>
                    Browse Menu
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}