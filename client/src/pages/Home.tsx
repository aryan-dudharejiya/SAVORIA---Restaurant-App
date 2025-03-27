import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@shared/schema";

const Home = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const { data: specialItems, isLoading } = useQuery({
    queryKey: ["/api/menu"],
    select: (data: MenuItem[]) => data.filter(item => 
      ["Truffle Pasta", "Wagyu Steak", "Chocolate Lava Cake"].includes(item.name)
    )
  });

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: Date.now(),
      menuItemId: item.id,
      name: item.name,
      price: parseFloat(item.price.toString()),
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=900&q=80')` 
          }}
        ></div>
        <div className="container mx-auto px-4 z-10 text-center">
          <p className="font-accent text-yellow-500 text-4xl md:text-5xl">Welcome to</p>
          <h1 className="font-heading text-white text-5xl md:text-7xl font-bold mt-2 mb-6">Savoria</h1>
          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Experience the art of fine dining with our exquisite dishes prepared by world-class chefs
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-full font-medium text-lg transition-all transform hover:scale-105"
              asChild
            >
              <Link href="/menu">
                <a>View Our Menu</a>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white hover:bg-opacity-90 text-primary rounded-full font-medium text-lg transition-all transform hover:scale-105"
              asChild
            >
              <Link href="/reservation">
                <a>Book a Table</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-6 md:p-8 bg-primary text-white">
                <h2 className="font-heading text-3xl font-bold mb-4">Opening Hours</h2>
                <p className="mb-6">We are open 7 days a week to serve you the finest cuisine.</p>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Monday - Thursday</span>
                    <span>11:00 AM - 10:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Friday - Saturday</span>
                    <span>11:00 AM - 11:30 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>10:00 AM - 10:00 PM</span>
                  </li>
                </ul>
              </div>
              <div 
                className="md:w-1/2 bg-cover bg-center h-64 md:h-auto"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80')` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Specials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-accent text-primary text-3xl">Our Specialties</p>
            <h2 className="font-heading text-4xl font-bold mt-2 mb-4">Chef's Recommendations</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Indulge in our most popular dishes, carefully crafted by our expert chefs using the finest ingredients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="shadow-lg">
                  <div className="h-64 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              specialItems?.map((item) => (
                <Card key={item.id} className="overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-heading text-xl font-bold">{item.name}</h3>
                      <span className="font-bold text-primary">${parseFloat(item.price.toString()).toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
