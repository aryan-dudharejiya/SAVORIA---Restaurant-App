import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, Review } from "@shared/schema";
import { MapPin, Clock, Wifi, Music, Utensils, Star, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  
  // Load popular menu items
  const { data: specialItems, isLoading } = useQuery({
    queryKey: ["/api/menu"],
    select: (data: MenuItem[]) => data.filter(item => 
      ["Truffle Pasta", "Wagyu Steak", "Chocolate Lava Cake"].includes(item.name)
    )
  });
  
  // Load all menu items for the carousel
  const { data: allMenuItems, isLoading: isMenuLoading } = useQuery({
    queryKey: ["/api/menu"],
    select: (data: MenuItem[]) => data.sort(() => Math.random() - 0.5).slice(0, 8) // Randomize and get 8 items
  });
  
  // Get reviews
  const { data: reviews, isLoading: isReviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });
  
  // Simulate image preloading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsImagesLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isImagesLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=900&q=80')` 
          }}
        ></div>
        {/* Animated overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="container mx-auto px-4 z-10 text-left md:text-center relative">
          <Badge variant="outline" className="text-yellow-400 border-yellow-400 mb-4 animate-pulse">Fine Dining Experience</Badge>
          <h1 className="font-heading text-white text-5xl md:text-7xl font-bold mt-2 mb-4 opacity-0 animate-[fadeIn_1s_ease-in-out_0.2s_forwards]">SAVORIA</h1>
          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-0 animate-[fadeIn_1s_ease-in-out_0.4s_forwards]">
            Experience the art of fine dining with our exquisite dishes prepared by world-class chefs using the freshest local ingredients
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 opacity-0 animate-[fadeIn_1s_ease-in-out_0.6s_forwards]">
            <Link href="/menu">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-full font-medium text-lg transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Order Online <ChevronRight size={16} />
              </Button>
            </Link>
            <Link href="/reservation">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white rounded-full font-medium text-lg transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Book a Table <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-8 h-12 rounded-full border-2 border-white flex items-start justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-[scrollDown_1.5s_infinite]"></div>
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
                <Card key={item.id} className="overflow-hidden shadow-lg menu-card">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover lazy-load"
                      onLoad={(e) => e.currentTarget.classList.add('loaded')}
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

      {/* Menu Carousel Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-accent text-primary text-3xl">Explore Our Menu</p>
            <h2 className="font-heading text-4xl font-bold mt-2 mb-4">Popular Dishes</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Browse through our most ordered dishes and customer favorites
            </p>
          </div>
          
          {isMenuLoading ? (
            <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
          ) : (
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {allMenuItems?.map((item) => (
                  <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <Card className="overflow-hidden shadow hover:shadow-lg transition-shadow">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover lazy-load"
                            onLoad={(e) => e.currentTarget.classList.add('loaded')}
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-heading text-lg font-bold">{item.name}</h3>
                            <span className="font-bold text-primary">${parseFloat(item.price.toString()).toFixed(2)}</span>
                          </div>
                          <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20">
                            {item.category}
                          </Badge>
                          <Button 
                            className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="relative inline-flex" />
                <CarouselNext className="relative inline-flex" />
              </div>
            </Carousel>
          )}
          
          <div className="text-center mt-8">
            <Link href="/menu">
              <Button variant="outline" className="rounded-full">
                View Full Menu <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Restaurant Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-accent text-primary text-3xl">Restaurant Features</p>
            <h2 className="font-heading text-4xl font-bold mt-2 mb-4">What We Offer</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Experience the perfect dining ambiance with our premium amenities and services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <MapPin className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">Prime Location</h3>
              <p className="text-gray-600">Located in the heart of the city with convenient parking facilities</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Wifi className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">Free Wi-Fi</h3>
              <p className="text-gray-600">Stay connected with our complimentary high-speed wireless internet</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Music className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">Live Music</h3>
              <p className="text-gray-600">Enjoy live performances every Friday and Saturday evening</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Utensils className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">Outdoor Seating</h3>
              <p className="text-gray-600">Dine in our beautiful garden area with spectacular views</p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Customer Reviews Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-accent text-primary text-3xl">Testimonials</p>
            <h2 className="font-heading text-4xl font-bold mt-2 mb-4">What Our Customers Say</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Read genuine reviews from our valued customers
            </p>
          </div>
          
          {isReviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-100 h-64 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {reviews?.map((review: Review) => (
                  <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <Card className="p-6 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                          <img 
                            src={`https://i.pravatar.cc/150?u=${review.id}`}
                            alt={review.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold">{review.name}</h4>
                          <div className="flex">
                            {Array(5).fill(0).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 flex-grow">{review.review}</p>
                      <p className="text-sm text-gray-400 mt-4">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-6">
                <CarouselPrevious className="relative inline-flex" />
                <CarouselNext className="relative inline-flex" />
              </div>
            </Carousel>
          )}
          
          <div className="text-center mt-8">
            <Link href="/reviews">
              <Button variant="outline" className="rounded-full">
                See All Reviews <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
