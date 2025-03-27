import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Review } from "@shared/schema";

const Reviews = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const itemsPerSlide = 3;
  
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["/api/reviews"]
  });
  
  const totalSlides = reviews ? Math.ceil(reviews.length / itemsPerSlide) : 0;
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-500 text-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-500 text-yellow-500" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-yellow-500" />);
    }
    
    return stars;
  };
  
  const currentReviews = reviews?.slice(
    activeSlide * itemsPerSlide,
    (activeSlide + 1) * itemsPerSlide
  );
  
  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-accent text-primary text-3xl">Testimonials</p>
          <h2 className="font-heading text-4xl font-bold mt-2 mb-4">What Our Customers Say</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Read what our satisfied customers have to say about their dining experience at Savoria.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Reviews Carousel */}
          <div className="reviews-carousel">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-gray-100 p-6 rounded-lg shadow animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="w-4 h-4 mr-1 bg-gray-300 rounded-full"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentReviews?.map((review: Review) => (
                  <div key={review.id} className="bg-gray-100 p-6 rounded-lg shadow transition-all hover:shadow-md">
                    <div className="flex items-center mb-4">
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h4 className="font-bold">{review.name}</h4>
                        <div className="flex text-yellow-500">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.review}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Carousel Navigation */}
            {totalSlides > 1 && (
              <div className="flex justify-center mt-8">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full mx-1 ${
                      activeSlide === index ? "bg-primary" : "bg-gray-300"
                    }`}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Google Reviews Integration */}
          <div className="mt-16 text-center">
            <h3 className="font-heading text-2xl font-bold mb-4">Check Our Google Reviews</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="flex text-yellow-500 mr-2">
                {renderStars(4.8)}
              </div>
              <span className="font-bold">4.8/5</span>
              <span className="text-gray-600 ml-2">(243 reviews)</span>
            </div>
            <Button
              variant="outline"
              className="inline-flex items-center bg-white border border-gray-300 px-6 py-3 rounded-lg shadow-sm hover:bg-gray-50"
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
      </div>
    </section>
  );
};

export default Reviews;
