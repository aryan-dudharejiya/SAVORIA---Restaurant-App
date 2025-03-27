import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, Review } from "@shared/schema";
import { 
  ChevronRight, 
  Clock, 
  MapPin, 
  Star, 
  UtensilsCrossed, 
  ArrowRight,
  Award,
  CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Home2 = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animations
  useEffect(() => {
    // Let the components load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Load featured menu items
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["/api/menu"],
  });
  
  // Get reviews
  const { data: reviews, isLoading: isReviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  // Featured items - first 3 items
  const featuredItems = menuItems ? menuItems.slice(0, 3) : [];
  
  // Popular items - next 4 items
  const popularItems = menuItems ? menuItems.slice(3, 7) : [];

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

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Video or image background */}
        <div className="absolute inset-0 bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={fadeInUp}
              className="text-center md:text-left max-w-xl mx-auto md:mx-0"
            >
              <Badge 
                variant="outline" 
                className="text-yellow-300 border-yellow-400/40 mb-4 inline-block"
              >
                Modern Fine Dining
              </Badge>
              
              <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                Extraordinary <span className="text-primary">Flavors</span>, <br />
                <span className="font-light">Unforgettable Experience</span>
              </h1>
              
              <p className="text-white/80 text-lg mb-8 max-w-xl">
                Experience the perfect harmony of taste and ambiance at Savoria. 
                Our culinary artisans craft each dish with passion using only the finest ingredients.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-md"
                  asChild
                >
                  <Link href="/menu">
                    View Menu <ChevronRight size={16} className="ml-1" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10 rounded-md"
                  asChild
                >
                  <Link href="/reservation">
                    Reserve a Table 
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.6, delay: 0.3 }
                }
              }}
              className="relative hidden md:flex justify-end"
            >
              <div className="relative w-full max-w-md">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-white/5 rounded-2xl transform -rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80" 
                  alt="Signature dish" 
                  className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-2xl"
                />
                
                {/* Stats card */}
                <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg z-20">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Award Winning</p>
                      <p className="text-xs text-gray-500">Chef's Signature Dishes</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Stats Banner */}
          <motion.div 
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, delay: 0.6 }
              }
            }}
            className="mt-16 md:mt-24 p-6 md:p-8 bg-white/5 backdrop-blur-md rounded-xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">15+</p>
                <p className="text-white/80 text-sm md:text-base">Years of Excellence</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">35+</p>
                <p className="text-white/80 text-sm md:text-base">Signature Dishes</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">4.9</p>
                <p className="text-white/80 text-sm md:text-base">Customer Rating</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">12k+</p>
                <p className="text-white/80 text-sm md:text-base">Happy Customers</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce hidden md:flex">
          <p className="text-white/60 text-xs mb-2 tracking-widest">SCROLL DOWN</p>
          <ArrowRight className="h-5 w-5 text-white/60 transform rotate-90" />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Our Restaurant" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm w-64 h-64 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white/90 text-sm font-light mb-1">ESTABLISHED</p>
                    <p className="text-white text-4xl font-bold">2008</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <Badge variant="outline" className="text-primary border-primary/30 mb-2">
                OUR STORY
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Welcome to <span className="text-primary">Savoria</span>
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Founded in 2008, Savoria has been a beacon of culinary excellence, 
                combining traditional techniques with innovative flavors to create an 
                extraordinary dining experience.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Our philosophy is simple - use the finest seasonal ingredients, 
                prepare them with precision and care, and serve them in an atmosphere 
                of warmth and sophistication. Every dish tells a story of passion and craftsmanship.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Farm-to-Table</h3>
                    <p className="text-sm text-gray-600">Locally sourced ingredients</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Award-Winning</h3>
                    <p className="text-sm text-gray-600">Recognized excellence</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Master Chefs</h3>
                    <p className="text-sm text-gray-600">Culinary experts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Perfect Ambiance</h3>
                    <p className="text-sm text-gray-600">Elegant atmosphere</p>
                  </div>
                </div>
              </div>
              
              <Button
                className="rounded-md"
                asChild
              >
                <Link href="/contact">
                  Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Special Menu Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="text-primary border-primary/30 mb-2">
              CHEF'S SELECTION
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Our Special Menu
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience our chef's carefully crafted signature dishes, featuring the finest ingredients
              and innovative culinary techniques.
            </p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
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
                <motion.div key={item.id} variants={fadeInUp}>
                  <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full">
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
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
                        <h3 className="font-bold text-xl">{item.name}</h3>
                        <span className="font-bold text-primary">${parseFloat(item.price.toString()).toFixed(2)}</span>
                      </div>
                      <p className="text-gray-600 mb-6 line-clamp-3">{item.description}</p>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white rounded-md"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="rounded-md" asChild>
              <Link href="/menu">
                View Full Menu <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Dishes Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <Badge variant="outline" className="text-primary border-primary/30 mb-2">
                POPULAR CHOICES
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Customer Favorites</h2>
            </div>
            <p className="text-gray-600 max-w-md mt-4 md:mt-0">
              Discover our most ordered dishes, loved by customers for their exceptional taste and presentation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-100 h-40 rounded-lg animate-pulse"></div>
              ))
            ) : (
              popularItems?.map((item: MenuItem) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="flex justify-between items-end">
                      <div>
                        <Badge className="bg-white/90 text-primary mb-2">
                          {item.category}
                        </Badge>
                        <h3 className="text-white font-bold text-lg">{item.name}</h3>
                        <p className="text-white/80 text-sm">${parseFloat(item.price.toString()).toFixed(2)}</p>
                      </div>
                      <Button 
                        size="icon"
                        className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 bg-primary hover:bg-primary/90"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform origin-top-right"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="text-primary border-primary/30 mb-2">
              TESTIMONIALS
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              What Our Guests Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read what our valued customers have to say about their dining experience at Savoria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isReviewsLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-100 p-6 rounded-lg animate-pulse h-64"></div>
              ))
            ) : (
              reviews?.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{review.name}</p>
                        <div className="flex mt-1">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i}
                              size={14} 
                              className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-primary/20">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.667 13.333H5.333C5.333 8 9.333 5.333 13.333 5.333V9.333C11.333 9.333 10.667 10.667 10.667 13.333ZM21.333 13.333H16C16 8 20 5.333 24 5.333V9.333C22 9.333 21.333 10.667 21.333 13.333Z"/>
                        <path d="M10.667 13.333C10.667 16 8 26.667 13.333 26.667C18.667 26.667 13.333 16 13.333 13.333C13.333 10.667 16 5.333 13.333 5.333C10.667 5.333 10.667 10.667 10.667 13.333ZM21.333 13.333C21.333 16 18.667 26.667 24 26.667C29.333 26.667 24 16 24 13.333C24 10.667 26.667 5.333 24 5.333C21.333 5.333 21.333 10.667 21.333 13.333Z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-4 mb-3">{review.review}</p>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="rounded-md" asChild>
              <Link href="/reviews">
                Read All Reviews <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="text-primary border-primary/30 mb-2">
                VISIT US
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Hours & Location
              </h2>
              <p className="text-gray-700 mb-8">
                We are conveniently located in the heart of the city, offering easy access and a welcoming atmosphere for your dining pleasure.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" /> Hours
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Monday - Thursday</span>
                      <span>11:00 AM - 10:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Friday - Saturday</span>
                      <span>11:00 AM - 11:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span>10:00 AM - 9:00 PM</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" /> Location
                  </h3>
                  <address className="not-italic">
                    <p>123 Culinary Street</p>
                    <p>Flavor District</p>
                    <p>Gastronomy City, GC 12345</p>
                    <p className="mt-2">
                      <a href="tel:+1234567890" className="text-primary hover:underline">(123) 456-7890</a>
                    </p>
                  </address>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="rounded-md" asChild>
                  <Link href="/reservation">
                    Reserve a Table
                  </Link>
                </Button>
                <Button variant="outline" className="rounded-md" asChild>
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-lg transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Restaurant interior" 
                className="relative z-10 rounded-lg shadow-lg w-full h-auto transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="pattern" width="5" height="5" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-white text-primary mb-4">
              TASTE THE DIFFERENCE
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready for an Exceptional<br />Dining Experience?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
              Join us at Savoria for a culinary journey that will delight your senses and create lasting memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 rounded-md"
                asChild
              >
                <Link href="/reservation">
                  Reserve a Table
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 rounded-md"
                asChild
              >
                <Link href="/menu">
                  Order Online
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home2;