import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, StarHalf, Quote, ThumbsUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@shared/schema";
import { motion } from "framer-motion";

const Reviews = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerSlide = 6; // Increased from 3 to 6
  
  // Animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["/api/reviews"]
  });
  
  const totalSlides = reviews ? Math.ceil(reviews.length / itemsPerSlide) : 0;
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-500 text-yellow-500" size={18} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-500 text-yellow-500" size={18} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={18} />);
    }
    
    return stars;
  };
  
  const currentReviews = reviews?.slice(
    activeSlide * itemsPerSlide,
    (activeSlide + 1) * itemsPerSlide
  );
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-primary/5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">CUSTOMER TESTIMONIALS</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              What Our <span className="text-primary">Guests</span> Say About Us
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-8">
              Discover authentic experiences shared by our valued customers who have enjoyed 
              our culinary creations and warm hospitality.
            </p>
            
            <div className="flex justify-center items-center space-x-2 mb-10">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`} 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">4.9</span>
                <span className="text-sm text-gray-600 ml-1">/5</span>
              </div>
              <div className="flex text-yellow-500">
                {renderStars(4.9)}
              </div>
              <span className="text-gray-600 text-sm">(200+ reviews)</span>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Main Reviews Section */}
      <section id="reviews" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-7xl mx-auto"
          >
            {/* Reviews Grid */}
            <div className="reviews-grid">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, index) => (
                    <Card key={index} className="shadow-sm border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                          <div className="ml-4">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                            <div className="flex">
                              {Array(5).fill(0).map((_, i) => (
                                <div key={i} className="w-4 h-4 mr-1 bg-gray-200 rounded-full animate-pulse"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentReviews?.map((review: Review) => (
                    <motion.div key={review.id} variants={fadeInUp}>
                      <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-0 bg-white shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                              <img 
                                src={review.avatar} 
                                alt={review.name} 
                                className="w-12 h-12 rounded-full object-cover shadow-sm"
                                loading="lazy"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{review.name}</p>
                                <div className="flex mt-1">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                            </div>
                            <div className="text-primary/20">
                              <Quote size={24} />
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-6">{review.review}</p>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                              {new Date().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex gap-2">
                              <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                <ThumbsUp size={16} className="text-gray-500" />
                              </button>
                              <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                <Share2 size={16} className="text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {totalSlides > 1 && (
                <div className="flex justify-center mt-12">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full mx-1 flex items-center justify-center border transition-colors ${
                        activeSlide === index 
                          ? "bg-primary text-white border-primary" 
                          : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Google Reviews Integration */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-50 text-blue-600 hover:bg-blue-100 border-none">GOOGLE REVIEWS</Badge>
            <h3 className="text-3xl font-bold mb-6">Join Thousands of Happy Customers</h3>
            <div className="flex items-center justify-center mb-8">
              <img 
                src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" 
                alt="Google logo" 
                className="w-8 h-8 mr-2" 
              />
              <div className="flex text-yellow-500 mr-2">
                {renderStars(4.8)}
              </div>
              <span className="font-bold">4.8/5</span>
              <span className="text-gray-600 ml-2">(243 verified reviews)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">Quality Food</h4>
                <p className="text-blue-700">95% of customers rated our food as excellent</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Great Service</h4>
                <p className="text-green-700">92% of customers praised our staff's service</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-lg">
                <h4 className="font-bold text-amber-800 mb-2">Amazing Atmosphere</h4>
                <p className="text-amber-700">90% loved the restaurant's ambiance</p>
              </div>
            </div>
            
            <Button
              size="lg"
              className="bg-white hover:bg-gray-50 border border-gray-300 shadow-sm rounded-md"
              onClick={() => window.open("https://www.google.com/maps/place/Savoria+Restaurant", "_blank")}
            >
              <img 
                src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" 
                alt="Google logo" 
                className="w-5 h-5 mr-2" 
              />
              <span>Read All Reviews on Google</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
