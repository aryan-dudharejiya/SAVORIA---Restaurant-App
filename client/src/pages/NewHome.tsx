import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, Review } from "@shared/schema";
import { ChevronRight, Clock, MapPin, Star, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NewHome = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Load featured menu items
  const { data: featuredItems, isLoading } = useQuery({
    queryKey: ["/api/menu"],
    select: (data: MenuItem[]) => data?.slice(0, 3)
  });
  
  // Get reviews
  const { data: reviews, isLoading: isReviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: Date.now(),
      menuItemId: item.id,
      name: item.name,
      price: parseFloat(item.price.toString()),
      quantity: 1,
      image: item.image
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] lg:h-[80vh] flex items-center overflow-hidden">
        {/* Hero Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), 
            url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover', 
            backgroundPosition: 'center'
          }}
        />
        
        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center md:text-left md:max-w-2xl lg:max-w-3xl">
            <Badge 
              variant="outline" 
              className="text-yellow-300 border-yellow-400/40 mb-4 inline-block"
            >
              Modern Fine Dining
            </Badge>
            
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-6">
              Authentic Flavors, <br />Modern Experience
            </h1>
            
            <p className="text-white/80 text-lg mb-8 max-w-xl">
              Experience the best cuisine with locally sourced ingredients prepared 
              by our world-class chefs in an elegant atmosphere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/menu">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-md w-full sm:w-auto"
                >
                  View Menu <ChevronRight size={16} className="ml-1" />
                </Button>
              </Link>
              <Link href="/reservation">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10 rounded-md w-full sm:w-auto"
                >
                  Reserve a Table 
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Exquisite Cuisine</h3>
              <p className="text-gray-600">
                Our chef creates memorable dishes using the finest local ingredients with international techniques.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Prime Location</h3>
              <p className="text-gray-600">
                Located in the heart of the city, our restaurant offers an elegant setting and convenient access.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Open Daily</h3>
              <p className="text-gray-600">
                We serve lunch and dinner seven days a week, with special hours for Sunday brunch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Menu Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-primary border-primary/30 mb-2">
              CHEF'S SELECTION
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Special Menu</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most popular dishes, crafted with fresh, high-quality ingredients 
              and prepared to perfection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="shadow-sm">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredItems?.map((item: MenuItem) => (
                <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary text-white">
                        Featured
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <span className="font-bold text-primary">${parseFloat(item.price.toString()).toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    <Button 
                      className="w-full"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/menu">
              <Button variant="outline" className="rounded-md">
                View Full Menu <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-primary border-primary/30 mb-2">
              CUSTOMER REVIEWS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - see what our valued customers have to say about their dining experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isReviewsLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-100 p-6 rounded-lg animate-pulse h-64"></div>
              ))
            ) : (
              reviews?.slice(0, 3).map((review: Review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i}
                          size={16} 
                          className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-4">{review.review}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{review.name}</p>
                      <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/reviews">
              <Button variant="outline" className="rounded-md">
                Read All Reviews <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to experience our cuisine?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/80">
            Book a table now or order online for a dining experience you won't forget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservation">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
              >
                Reserve a Table
              </Button>
            </Link>
            <Link href="/menu">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white/10 w-full sm:w-auto"
              >
                Order Online
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewHome;