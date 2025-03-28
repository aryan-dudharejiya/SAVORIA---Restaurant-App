import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, Review } from "@shared/schema";
import { ChevronRight, UtensilsCrossed, Clock } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isImagesLoaded, setImagesLoaded] = useState(true);

  // Load popular menu items
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["/api/menu"],
  });

  // Get reviews
  const { data: reviews, isLoading: isReviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  // Prepare menu item sections
  const specialItems = menuItems?.slice(0, 3);
  const allMenuItems = menuItems?.slice(0, 9);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: Date.now(),
      menuItemId: item.id,
      name: item.name,
      price: parseFloat(item.price.toString()),
      quantity: 1,
      image: item.image,
    });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1500 transform scale-105 ${
            isImagesLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200&q=80')`,
            transform: "scale(1.05)",
            transformOrigin: "center",
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: "slowZoom 30s infinite alternate",
          }}
        ></div>

        {/* Animated overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        {/* Floating elements for decoration */}
        <div className="absolute w-32 h-32 top-20 right-[20%] opacity-20 rounded-full bg-primary blur-2xl animate-pulse"></div>
        <div className="absolute w-44 h-44 bottom-[20%] left-[15%] opacity-10 rounded-full bg-yellow-400 blur-3xl animate-pulse"></div>

        {/* Content */}
        <div className="container mx-auto px-6 z-10 text-left lg:text-center relative">
          {/* Glowing badge */}
          <div className="inline-block mb-4 animate-pulse">
            <Badge
              variant="outline"
              className="text-yellow-400 border-yellow-400 px-4 py-1 text-sm font-medium tracking-wider backdrop-blur-sm"
            >
              <span className="animate-pulse mr-1">✦</span> FINE DINING
              EXPERIENCE <span className="animate-pulse ml-1">✦</span>
            </Badge>
          </div>

          {/* Hero title with shadow effect */}
          <h1 className="font-heading text-white text-5xl md:text-7xl font-bold mt-2 mb-4 opacity-0 animate-[fadeIn_1s_ease-in-out_0.2s_forwards] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            SAVORIA
          </h1>

          {/* Subtitle with elegant typography */}
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-0 animate-[fadeIn_1s_ease-in-out_0.4s_forwards] leading-relaxed font-light">
            Experience the art of fine dining with our exquisite dishes prepared
            by world-class chefs using the freshest local ingredients
          </p>

          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 opacity-0 animate-[fadeIn_1s_ease-in-out_0.6s_forwards]">
            <Link href="/menu">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-full font-medium text-lg transition-all transform hover:scale-105 hover:shadow-glow flex items-center gap-2 h-14 px-8"
              >
                Order Online <ChevronRight size={18} />
              </Button>
            </Link>
            <Link href="/reservation">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-2 hover:bg-white/20 text-white border-white/80 rounded-full font-medium text-lg transition-all transform hover:scale-105 hover:shadow-glow flex items-center gap-2 h-14 px-8"
              >
                Book a Table <ChevronRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-500">
              <div className="md:w-1/2 p-8 md:p-10 bg-gradient-to-br from-primary to-primary/80 text-white relative">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 transform rotate-45 translate-x-10 -translate-y-10"></div>

                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm">
                  Opening Hours
                </h2>
                <p className="mb-8 text-white/90 leading-relaxed">
                  We are open 7 days a week to serve you the finest cuisine in
                  an elegant atmosphere.
                </p>

                <ul className="space-y-5">
                  <li className="flex justify-between items-center border-b border-white/20 pb-3">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 opacity-80" />
                      <span className="font-medium">Monday - Thursday</span>
                    </div>
                    <span className="font-light text-white/90">
                      11:00 AM - 10:00 PM
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/20 pb-3">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 opacity-80" />
                      <span className="font-medium">Friday - Saturday</span>
                    </div>
                    <span className="font-light text-white/90">
                      11:00 AM - 11:30 PM
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 opacity-80" />
                      <span className="font-medium">Sunday</span>
                    </div>
                    <span className="font-light text-white/90">
                      10:00 AM - 10:00 PM
                    </span>
                  </li>
                </ul>

                <div className="mt-10">
                  <Link href="/reservation">
                    <Button
                      variant="outline"
                      className="border-white hover:bg-white hover:text-primary rounded-full px-5 transition-all"
                    >
                      Reserve a Table
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="md:w-1/2 overflow-hidden">
                <div
                  className="h-64 md:h-full w-full bg-cover bg-center transform hover:scale-105 transition-transform duration-1000"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=85')`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specials Section */}
      <section className="py-20 bg-gray-50 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-2">
              <Badge
                variant="outline"
                className="text-primary border-primary/30 px-4 py-1"
              >
                SIGNATURE DISHES
              </Badge>
            </div>
            <p className="font-accent text-primary text-3xl mt-2">
              Our Specialties
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-6">
              Chef's Recommendations
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Indulge in our most popular dishes, carefully crafted by our
              expert chefs using the finest ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
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
              : specialItems?.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden shadow-xl menu-card rounded-xl border-0"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover lazy-load transition-transform duration-700 hover:scale-110"
                        onLoad={(e) => e.currentTarget.classList.add("loaded")}
                        loading="lazy"
                      />
                      <div className="absolute top-4 right-4 z-20">
                        <Badge className="bg-primary text-white border-0 shadow-md px-3 py-1">
                          Chef's Choice
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-heading text-xl font-bold">
                          {item.name}
                        </h3>
                        <span className="font-bold text-primary text-lg">
                          ${parseFloat(item.price.toString()).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-5 line-clamp-3">
                        {item.description}
                      </p>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-lg font-medium text-base transition-all transform hover:translate-y-[-2px] hover:shadow-md"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/menu">
              <Button
                variant="outline"
                className="rounded-full px-6 border-gray-300 hover:border-primary/70 hover:bg-primary/5"
              >
                View All Specialties <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Menu Carousel Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute left-0 w-full h-32 top-0 bg-gradient-to-b from-gray-50 to-transparent"></div>

        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center mb-16">
            <div className="inline-block mb-2">
              <Badge
                variant="outline"
                className="text-primary border-primary/30 px-4 py-1"
              >
                MENU HIGHLIGHTS
              </Badge>
            </div>
            <p className="font-accent text-primary text-3xl mt-2">
              Explore Our Menu
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-6">
              Popular Dishes
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Browse through our most ordered dishes and customer favorites,
              each crafted with passion
            </p>
          </div>

          {isMenuLoading ? (
            <div className="h-80 bg-gray-100 animate-pulse rounded-xl"></div>
          ) : (
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {allMenuItems?.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="md:basis-1/2 lg:basis-1/3 pl-4 pb-10"
                    >
                      <div className="p-1">
                        <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0 rounded-xl h-full">
                          <div className="relative h-48 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center bg-amber-100 z-10">
                              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-40"></div>
                            <img
                              src={`${item.image}${
                                item.image.includes("?") ? "&" : "?"
                              }cb=${Date.now()}`}
                              alt={item.name}
                              className="w-full h-full object-cover lazy-load transition-transform duration-700 hover:scale-110 z-20 relative"
                              onLoad={(e) => {
                                e.currentTarget.classList.add("loaded");
                                e.currentTarget.style.zIndex = "30";
                                // Find parent div's first child (spinner) and hide it
                                const spinner =
                                  e.currentTarget.parentElement?.querySelector(
                                    "div:first-of-type"
                                  );
                                if (spinner) spinner.style.display = "none";
                              }}
                              onError={(e) => {
                                // Fallback to different image sources if loading fails
                                const fallbackImages = [
                                  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=500&h=500",
                                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=500&h=500",
                                  "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=500&h=500",
                                ];

                                // Try a random fallback image
                                e.currentTarget.src =
                                  fallbackImages[
                                    Math.floor(
                                      Math.random() * fallbackImages.length
                                    )
                                  ];
                                e.currentTarget.classList.add("loaded");
                                e.currentTarget.style.zIndex = "30";

                                // Find parent div's first child (spinner) and hide it
                                const spinner =
                                  e.currentTarget.parentElement?.querySelector(
                                    "div:first-of-type"
                                  );
                                if (spinner) spinner.style.display = "none";
                              }}
                              loading="lazy"
                            />
                            <div className="absolute bottom-2 left-2 z-20">
                              <Badge className="bg-white/90 text-primary hover:bg-white">
                                {item.category}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-heading text-lg font-bold line-clamp-1">
                                {item.name}
                              </h3>
                              <span className="font-bold text-primary">
                                ${parseFloat(item.price.toString()).toFixed(2)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                              {item.description}
                            </p>
                            <Button
                              className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-10"
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
                <div className="flex justify-center gap-4 mt-8">
                  <CarouselPrevious className="relative inline-flex h-10 w-10 rounded-full border border-gray-200" />
                  <CarouselNext className="relative inline-flex h-10 w-10 rounded-full border border-gray-200" />
                </div>
              </Carousel>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/menu">
              <Button
                variant="outline"
                className="rounded-full px-8 border-gray-300 hover:border-primary/70 hover:bg-primary/5 h-12"
              >
                Explore Full Menu <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Restaurant Features Section */}
      <section className="py-20 bg-gray-50 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60')] bg-cover bg-center opacity-5"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-2">
              <Badge
                variant="outline"
                className="text-primary border-primary/30 px-4 py-1"
              >
                SAVORIA EXPERIENCE
              </Badge>
            </div>
            <p className="font-accent text-primary text-3xl mt-2">
              Restaurant Features
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-6">
              What We Offer
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Experience the perfect dining ambiance with our premium amenities
              and services designed for your comfort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="group">
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">
                  Prime Location
                </h3>
                <p className="text-gray-600">
                  Located in the heart of the city with convenient parking
                  facilities and easy access to public transport
                </p>
              </Card>
            </div>

            <div className="group">
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Wifi className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">
                  Free Wi-Fi
                </h3>
                <p className="text-gray-600">
                  Stay connected with our complimentary high-speed wireless
                  internet throughout the restaurant
                </p>
              </Card>
            </div>

            <div className="group">
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Music className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">
                  Live Music
                </h3>
                <p className="text-gray-600">
                  Enjoy live performances by talented musicians every Friday and
                  Saturday evening
                </p>
              </Card>
            </div>

            <div className="group">
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Utensils className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">
                  Outdoor Seating
                </h3>
                <p className="text-gray-600">
                  Dine in our beautiful garden terrace with spectacular views of
                  the city skyline
                </p>
              </Card>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center">
              <div className="text-center p-4">
                <div className="text-4xl font-heading font-bold text-primary mb-2">
                  15+
                </div>
                <p className="text-gray-600">Years of Excellence</p>
              </div>
              <div className="text-center p-4 border-t md:border-t-0 md:border-l md:border-r border-gray-100">
                <div className="text-4xl font-heading font-bold text-primary mb-2">
                  30+
                </div>
                <p className="text-gray-600">Award-Winning Dishes</p>
              </div>
              <div className="text-center p-4 border-t md:border-t-0 border-gray-100">
                <div className="text-4xl font-heading font-bold text-primary mb-2">
                  5000+
                </div>
                <p className="text-gray-600">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 relative overflow-hidden bg-gradient-to-r from-primary/90 to-primary">
        {/* Decorative elements */}
        <div className="absolute w-64 h-64 top-0 left-1/4 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute w-80 h-80 bottom-0 right-1/4 bg-white/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-10 text-white">
                <div className="inline-block mb-4 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  LIMITED TIME OFFER
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                  Get 20% Off on Your First Order!
                </h2>
                <p className="mb-6 text-white/80">
                  Experience our exquisite cuisine with a special discount for
                  new customers. Use promo code{" "}
                  <span className="font-bold bg-primary/60 px-2 py-1 rounded">
                    WELCOME20
                  </span>{" "}
                  at checkout.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/menu">
                    <Button className="bg-white text-primary hover:bg-white/90 h-12 px-6 rounded-full font-medium">
                      Claim Offer
                    </Button>
                  </Link>
                  <div className="flex items-center text-white/80 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Offer expires in 7 days</span>
                  </div>
                </div>
              </div>
              <div className="relative h-60 md:h-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/40 z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1559847844-5315695dad5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Special Offer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-0 w-64 h-64 rounded-full bg-primary/5 -translate-x-1/2"></div>
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-primary/5 translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-2">
              <Badge
                variant="outline"
                className="text-primary border-primary/30 px-4 py-1"
              >
                DINER EXPERIENCES
              </Badge>
            </div>
            <p className="font-accent text-primary text-3xl mt-2">
              Testimonials
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-6">
              What Our Customers Say
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Read genuine reviews from our valued customers who have
              experienced our hospitality and cuisine
            </p>
          </div>

          <div className="relative">
            {/* Quote decorations */}
            <div className="hidden md:block absolute -top-10 left-10 text-9xl text-primary/10 font-serif">
              "
            </div>
            <div className="hidden md:block absolute -bottom-10 right-10 text-9xl text-primary/10 font-serif rotate-180">
              "
            </div>

            {isReviewsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 h-64 animate-pulse rounded-lg"
                    ></div>
                  ))}
              </div>
            ) : (
              <Carousel
                className="w-full max-w-5xl mx-auto"
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {reviews?.map((review: Review) => (
                    <CarouselItem
                      key={review.id}
                      className="md:basis-1/2 lg:basis-1/3 pl-4 pb-10"
                    >
                      <Card className="p-8 h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl">
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 rounded-full bg-primary/10 p-1 shadow-md overflow-hidden">
                            <img
                              src={`https://randomuser.me/api/portraits/${
                                review.id % 2 === 0 ? "women" : "men"
                              }/${review.id % 70}.jpg`}
                              alt={review.name}
                              className="w-full h-full object-cover rounded-full"
                              loading="lazy"
                            />
                          </div>
                          <div className="ml-4">
                            <h4 className="font-heading text-lg font-bold">
                              {review.name}
                            </h4>
                            <div className="flex mt-1">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                            </div>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-2 -top-2 text-3xl text-primary/20 font-serif">
                            "
                          </div>
                          <p className="text-gray-600 flex-grow italic pt-2 px-3 leading-relaxed">
                            {review.review}
                          </p>
                          <div className="absolute -right-2 bottom-0 text-3xl text-primary/20 font-serif rotate-180">
                            "
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-400 flex items-center">
                            <span className="w-2 h-2 bg-primary/40 rounded-full mr-2"></span>
                            {new Date().toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-4 mt-8">
                  <CarouselPrevious className="relative inline-flex h-10 w-10 rounded-full border border-gray-200" />
                  <CarouselNext className="relative inline-flex h-10 w-10 rounded-full border border-gray-200" />
                </div>
              </Carousel>
            )}
          </div>

          <div className="text-center mt-12">
            <p className="mb-4 text-gray-600">
              Rated 4.8 out of 5 based on 240+ reviews
            </p>
            <Link href="/reviews">
              <Button
                variant="outline"
                className="rounded-full px-8 border-gray-300 hover:border-primary/70 hover:bg-primary/5 h-12"
              >
                Read All Reviews <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
