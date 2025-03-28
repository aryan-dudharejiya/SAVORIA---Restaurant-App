import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  StarHalf,
  Filter,
  ShoppingCart,
  Info,
  Sparkles,
  ChefHat,
  Award,
  Heart,
  ChevronDown,
  PlusCircle,
  Loader2,
  SlidersHorizontal,
  ChevronsUpDown,
} from "lucide-react";
import { CardContent, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuItem, Review } from "@shared/schema";

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceSort, setPriceSort] = useState<"none" | "low-high" | "high-low">(
    "none"
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Record<number, boolean>>({});
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isMobile = useIsMobile();

  // Data fetching
  const { data: menuItems, isLoading: isMenuLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const { addToCart } = useCart();
  const { toast } = useToast();

  // Create a map of menu item ids to their average ratings
  const itemRatings = reviews
    ? reviews.reduce((acc: Record<number, number[]>, review) => {
        // For demo, we'll randomly assign reviews to menu items
        // In a real app, there would be a direct relationship between reviews and menu items
        const randomMenuItemId =
          Math.floor(Math.random() * (menuItems?.length || 1)) + 1;
        if (!acc[randomMenuItemId]) acc[randomMenuItemId] = [];
        acc[randomMenuItemId].push(review.rating);
        return acc;
      }, {})
    : {};

  // Calculate average rating for a menu item
  const getAverageRating = (itemId: number) => {
    const ratings = itemRatings[itemId];
    if (!ratings || ratings.length === 0) return 4.5; // Default rating
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  // Get relevant reviews for a menu item
  const getItemReviews = (itemId: number, limit = 2) => {
    if (!reviews) return [];
    // For demo, we'll randomly assign reviews to menu items
    // In a real app, you would filter reviews related to this specific item
    return reviews.slice(0, limit);
  };

  // Scroll observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({
              ...prev,
              [parseInt(entry.target.id.split("-")[1])]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all menu item elements
    const menuElements = document.querySelectorAll('[id^="menu-item-"]');
    menuElements.forEach((el) => observer.observe(el));

    return () => {
      menuElements.forEach((el) => observer.unobserve(el));
    };
  }, [menuItems, categoryFilter, searchQuery]);

  // Scroll to category
  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    if (categoryRefs.current[category]) {
      categoryRefs.current[category]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Add to cart handler with animation
  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: Date.now(),
      menuItemId: item.id,
      name: item.name,
      price: parseFloat(item.price.toString()),
      quantity: 1,
      image: item.image,
    });

    // Create floating element for animation
    const floatingEl = document.createElement("div");
    floatingEl.className =
      "fixed z-50 flex items-center justify-center text-white rounded-full";
    floatingEl.innerHTML = `<span class="flex items-center justify-center w-8 h-8 bg-primary rounded-full shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
    </span>`;
    document.body.appendChild(floatingEl);

    // Get positions
    const rect = document
      .getElementById(`menu-item-${item.id}`)
      ?.getBoundingClientRect();
    const cartIconRect = document
      .querySelector(".cart-icon")
      ?.getBoundingClientRect();

    if (rect && cartIconRect) {
      // Set initial position
      floatingEl.style.top = `${rect.top + 40}px`;
      floatingEl.style.left = `${rect.left + 40}px`;

      // Animate to cart
      floatingEl.animate(
        [
          {
            top: `${rect.top + 40}px`,
            left: `${rect.left + 40}px`,
            opacity: 1,
            transform: "scale(1)",
          },
          {
            top: `${cartIconRect.top + 20}px`,
            left: `${cartIconRect.left + 20}px`,
            opacity: 0,
            transform: "scale(0.5)",
          },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        }
      ).onfinish = () => {
        document.body.removeChild(floatingEl);
        toast({
          title: "Added to cart",
          description: `${item.name} has been added to your cart.`,
        });
      };
    } else {
      document.body.removeChild(floatingEl);
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
    }
  };

  // Filter and sort items
  const processedItems = menuItems
    ? [...menuItems]
        .filter((item: MenuItem) => {
          // Apply text search filter
          const matchesSearch =
            searchQuery === "" ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());

          // Apply category filter
          const matchesCategory =
            categoryFilter === "all" || item.category === categoryFilter;

          return matchesSearch && matchesCategory;
        })
        .sort((a: MenuItem, b: MenuItem) => {
          // Apply price sorting
          if (priceSort === "low-high") {
            return (
              parseFloat(a.price.toString()) - parseFloat(b.price.toString())
            );
          } else if (priceSort === "high-low") {
            return (
              parseFloat(b.price.toString()) - parseFloat(a.price.toString())
            );
          }
          return 0;
        })
    : [];

  // Group items by category
  const groupedItems = processedItems.reduce(
    (acc: Record<string, MenuItem[]>, item: MenuItem) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  const categoryTitles: Record<string, string> = {
    starters: "Starters",
    main: "Main Course",
    desserts: "Desserts",
    drinks: "Drinks",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
      },
    },
  };

  return (
    <section className="pt-12 pb-24 bg-[#FAF5E9]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pb-6 sm:pb-8 md:pb-12 mb-6 sm:mb-8 md:mb-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge
              variant="outline"
              className="text-primary border-primary/30 px-3 sm:px-4 py-0.5 sm:py-1 mb-3 sm:mb-4 inline-flex items-center"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-amber-500" />
              CULINARY EXCELLENCE
            </Badge>
          </motion.div>

          <motion.h1
            className="font-['Poppins'] text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our Exquisite Menu
          </motion.h1>

          <motion.p
            className="font-['Roboto'] max-w-2xl mx-auto text-center text-[#3D2C2E] mb-6 sm:mb-8 text-base sm:text-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our chef-crafted dishes made with premium ingredients and
            culinary expertise. From appetizing starters to delectable desserts,
            there's something for every palate.
          </motion.p>

          {/* Category Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex justify-center overflow-x-auto pb-2 scrollbar-hide">
              <Tabs
                defaultValue="all"
                className="w-full max-w-full sm:max-w-2xl"
              >
                <TabsList className="bg-[#F7F7F7] p-1.5 rounded-xl shadow-[0px_2px_6px_rgba(0,0,0,0.05)] w-full flex overflow-x-auto snap-x">
                  <TabsTrigger
                    value="all"
                    className={`rounded-lg px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-['Poppins'] font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                      activeCategory === "all"
                        ? "bg-[#D72638] text-white shadow-sm"
                        : "text-[#3D2C2E] hover:bg-[#FFF3E3]"
                    }`}
                    onClick={() => scrollToCategory("all")}
                  >
                    All Menu
                  </TabsTrigger>
                  {Object.keys(categoryTitles).map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className={`rounded-lg px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-['Poppins'] font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                        activeCategory === category
                          ? "bg-[#D72638] text-white shadow-sm"
                          : "text-[#3D2C2E] hover:bg-[#FFF3E3]"
                      }`}
                      onClick={() => scrollToCategory(category)}
                    >
                      {categoryTitles[category]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <Card className="backdrop-blur-sm bg-[#F7F7F7] border border-amber-100 shadow-[0px_4px_12px_rgba(0,0,0,0.07)] rounded-xl">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search our menu by name or ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-4 sm:py-6 pl-10 sm:pl-12 pr-10 sm:pr-4 border-[#D1D5DB] border-[1.5px] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] bg-[#FFF3E3] text-[#3D2C2E] text-sm sm:text-base font-['Roboto'] placeholder:text-[#9CA3AF] focus-visible:ring-[#D72638] focus-visible:border-[#D72638] hover:border-[#D72638]/50"
                  />
                  <Search
                    className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-amber-500"
                    size={isMobile ? 16 : 18}
                  />

                  {/* Clear Search Button - Show only when there's text */}
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600"
                    >
                      <span className="sr-only">Clear search</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </Button>
                  )}

                  {/* Filter Toggle - Mobile Only */}
                  {isMobile && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-lg border-amber-200 bg-white text-amber-600 hover:bg-amber-50 hover:border-amber-300"
                      aria-label="Toggle filters"
                    >
                      <SlidersHorizontal size={isMobile ? 14 : 16} />
                    </Button>
                  )}
                </div>

                {/* Filters - Desktop or when expanded on mobile */}
                {(!isMobile || isFiltersOpen) && (
                  <motion.div
                    initial={
                      isMobile ? { height: 0, opacity: 0 } : { opacity: 1 }
                    }
                    animate={
                      isMobile ? { height: "auto", opacity: 1 } : { opacity: 1 }
                    }
                    exit={isMobile ? { height: 0, opacity: 0 } : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col sm:flex-row gap-4 ${
                      isMobile ? "pt-3 overflow-hidden" : ""
                    }`}
                  >
                    {/* Category Filter */}
                    <div className="flex-1">
                      <label className="text-sm font-['Poppins'] font-semibold text-[#3D2C2E] mb-1.5 sm:mb-2 block">
                        Category
                      </label>
                      <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                      >
                        <SelectTrigger className="py-1.5 sm:py-2 px-3 sm:px-4 border-[#D1D5DB] border-[1.5px] rounded-lg bg-[#FFF3E3] font-['Roboto'] text-[#3D2C2E] shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:border-[#D72638]/50">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="border-[#D1D5DB] rounded-lg bg-white font-['Roboto']">
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="starters">Starters</SelectItem>
                          <SelectItem value="main">Main Course</SelectItem>
                          <SelectItem value="desserts">Desserts</SelectItem>
                          <SelectItem value="drinks">Drinks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Sorting */}
                    <div className="flex-1">
                      <label className="text-sm font-['Poppins'] font-semibold text-[#3D2C2E] mb-1.5 sm:mb-2 block">
                        Sort by Price
                      </label>
                      <Select
                        value={priceSort}
                        onValueChange={(
                          value: "none" | "low-high" | "high-low"
                        ) => setPriceSort(value)}
                      >
                        <SelectTrigger className="py-1.5 sm:py-2 px-3 sm:px-4 border-[#D1D5DB] border-[1.5px] rounded-lg bg-[#FFF3E3] font-['Roboto'] text-[#3D2C2E] shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:border-[#D72638]/50">
                          <SelectValue placeholder="Sort by Price" />
                        </SelectTrigger>
                        <SelectContent className="border-[#D1D5DB] rounded-lg bg-white font-['Roboto']">
                          <SelectItem value="none">No Sorting</SelectItem>
                          <SelectItem value="low-high">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="high-low">
                            Price: High to Low
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Menu Content Section */}
      <div className="container mx-auto px-2 sm:px-4 mt-4 sm:mt-8 md:mt-12 max-w-7xl">
        {/* Loading State */}
        {isMenuLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden bg-white border-amber-100 animate-pulse"
                >
                  <div className="h-40 xs:h-48 sm:h-56 bg-amber-200/50 rounded-t-xl"></div>
                  <CardContent className="p-4 sm:p-6">
                    <div className="h-5 sm:h-6 bg-amber-200/50 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-amber-200/50 rounded w-1/4 mb-4"></div>
                    <div className="h-3 sm:h-4 bg-amber-200/50 rounded w-full mb-2"></div>
                    <div className="h-3 sm:h-4 bg-amber-200/50 rounded w-full mb-2"></div>
                    <div className="h-3 sm:h-4 bg-amber-200/50 rounded w-2/3 mb-4"></div>
                    <div className="flex gap-1.5 sm:gap-2 mb-4">
                      <div className="h-3 sm:h-4 w-3 sm:w-4 bg-amber-200/50 rounded-full"></div>
                      <div className="h-3 sm:h-4 w-3 sm:w-4 bg-amber-200/50 rounded-full"></div>
                      <div className="h-3 sm:h-4 w-3 sm:w-4 bg-amber-200/50 rounded-full"></div>
                      <div className="h-3 sm:h-4 w-3 sm:w-4 bg-amber-200/50 rounded-full"></div>
                      <div className="h-3 sm:h-4 w-3 sm:w-4 bg-amber-200/50 rounded-full"></div>
                    </div>
                    <div className="h-8 sm:h-10 bg-amber-200/50 rounded-lg mt-4"></div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : processedItems.length === 0 ? (
          // No results state
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12 bg-white/50 backdrop-blur-sm rounded-xl border border-amber-100 shadow-sm"
          >
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-amber-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-amber-800 mb-2">
              No menu items found
            </h3>
            <p className="text-amber-600 mb-6 max-w-md mx-auto">
              We couldn't find any dishes matching your search criteria. Please
              try again with different keywords or filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setPriceSort("none");
              }}
              className="bg-white border-amber-300 text-amber-800 hover:bg-amber-50"
            >
              Clear All Filters
            </Button>
          </motion.div>
        ) : (
          // Menu grid with categories
          <div>
            {/* Category Sections */}
            <AnimatePresence mode="wait">
              {Object.entries(groupedItems).map(([category, items]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="mb-16"
                  ref={(el) => (categoryRefs.current[category] = el)}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                      {category === "starters" && (
                        <Sparkles className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                      )}
                      {category === "main" && (
                        <ChefHat className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                      )}
                      {category === "desserts" && (
                        <Heart className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                      )}
                      {category === "drinks" && (
                        <ChevronsUpDown className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                      )}
                    </div>
                    <div>
                      <h2
                        className="text-2xl sm:text-3xl font-['Poppins'] font-bold text-[#3D2C2E] capitalize relative after:absolute after:h-1 after:w-12 after:bg-amber-400 after:-bottom-2 after:left-0 after:rounded-full"
                        id={`${category}-heading`}
                      >
                        {categoryTitles[category]}
                      </h2>
                      <p className="text-amber-600 text-xs sm:text-sm font-['Roboto'] mt-3">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items Grid */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8"
                  >
                    {items.map((item: MenuItem) => {
                      const rating = getAverageRating(item.id);
                      return (
                        <motion.div
                          key={item.id}
                          id={`menu-item-${item.id}`}
                          variants={itemVariants}
                          layout
                          whileHover={{ y: -5 }}
                          className="h-full"
                        >
                          <Card className="overflow-hidden h-full bg-[#F7F7F7] border-amber-100 hover:shadow-[0px_4px_16px_rgba(0,0,0,0.15)] transition-all duration-500 hover:border-amber-300 relative group rounded-xl transform hover:-translate-y-1">
                            {/* Featured or popular badge */}
                            {item.id % 5 === 0 && (
                              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                                <Badge className="bg-amber-600 text-white border-0 shadow-lg backdrop-blur-sm text-xs px-2 py-0.5 sm:px-2.5 sm:py-1">
                                  <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />{" "}
                                  Chef's Special
                                </Badge>
                              </div>
                            )}

                            {/* Item Image with overlay */}
                            <div className="relative h-40 xs:h-48 sm:h-56 overflow-hidden bg-amber-100 rounded-t-xl">
                              <div className="absolute inset-0 flex items-center justify-center bg-amber-100 z-10">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                              <img
                                src={`${item.image}${
                                  item.image.includes("?") ? "&" : "?"
                                }cb=${Date.now()}`}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-20 relative"
                                loading="lazy"
                                onLoad={(e) => {
                                  // Hide spinner when image loads
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

                                  // Set the loaded status
                                  e.currentTarget.style.zIndex = "30";
                                  // Find parent div's first child (spinner) and hide it
                                  const spinner =
                                    e.currentTarget.parentElement?.querySelector(
                                      "div:first-of-type"
                                    );
                                  if (spinner) spinner.style.display = "none";
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-40"></div>
                              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-end">
                                <div>
                                  {/* Rating Stars */}
                                  <div className="flex items-center gap-0.5 mb-1">
                                    {Array(5)
                                      .fill(0)
                                      .map((_, i) => {
                                        const starValue = i + 1;
                                        if (starValue <= Math.floor(rating)) {
                                          return (
                                            <Star
                                              key={i}
                                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400"
                                            />
                                          );
                                        } else if (starValue - 0.5 <= rating) {
                                          return (
                                            <StarHalf
                                              key={i}
                                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400"
                                            />
                                          );
                                        } else {
                                          return (
                                            <Star
                                              key={i}
                                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300"
                                            />
                                          );
                                        }
                                      })}
                                    <span className="text-white text-xs ml-1 font-medium">
                                      {rating.toFixed(1)}
                                    </span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="bg-white/10 backdrop-blur-sm text-white border-white/20 font-normal text-xs"
                                  >
                                    {item.category}
                                  </Badge>
                                </div>
                                <div className="text-white font-bold text-lg sm:text-xl drop-shadow-md">
                                  $
                                  {parseFloat(item.price.toString()).toFixed(2)}
                                </div>
                              </div>
                            </div>

                            {/* Item Details */}
                            <CardContent className="p-4 sm:p-6 flex flex-col h-[calc(100%-192px)] sm:h-[calc(100%-224px)]">
                              <h3 className="font-['Inter'] font-semibold text-lg sm:text-xl text-[#3D2C2E] mb-1 sm:mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                {item.name}
                              </h3>

                              <p className="font-['Roboto'] text-[#3D2C2E] mb-3 sm:mb-4 line-clamp-3 text-xs sm:text-sm flex-grow">
                                {item.description}
                              </p>

                              {/* Food attribute badges (mock data) */}
                              {item.id % 2 === 0 && (
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-200 text-[10px] sm:text-xs py-0.5"
                                  >
                                    Gluten-Free
                                  </Badge>
                                  {item.id % 4 === 0 && (
                                    <Badge
                                      variant="outline"
                                      className="bg-red-50 text-red-700 border-red-200 text-[10px] sm:text-xs py-0.5"
                                    >
                                      Spicy
                                    </Badge>
                                  )}
                                  {item.id % 3 === 0 && (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] sm:text-xs py-0.5"
                                    >
                                      Chef's Choice
                                    </Badge>
                                  )}
                                </div>
                              )}

                              <div className="flex gap-2 mt-auto">
                                {/* Add to Cart Button */}
                                <Button
                                  className="flex-1 bg-[#D72638] hover:bg-[#D72638]/90 text-white rounded-lg py-1.5 sm:py-2 shadow-md transition-all duration-300 text-sm sm:text-base font-medium hover:shadow-lg transform hover:scale-[1.03] h-auto min-h-9"
                                  onClick={() => handleAddToCart(item)}
                                >
                                  <ShoppingCart className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />{" "}
                                  Add to Cart
                                </Button>

                                {/* View Details Button - Show icon only on smallest screens */}
                                <Button
                                  className="bg-transparent border-2 border-[#FF914D] text-[#FF914D] hover:bg-[#FF914D]/10 rounded-lg py-1.5 sm:py-2 transition-all duration-300 text-sm sm:text-base font-medium transform hover:scale-[1.03] h-auto min-h-9 relative overflow-hidden group"
                                  onClick={() =>
                                    toast({
                                      title: "Item Details",
                                      description: `You're viewing details for ${item.name}.`,
                                    })
                                  }
                                >
                                  <span className="relative z-10 flex items-center">
                                    <Info className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />{" "}
                                    <span className="hidden xs:inline">
                                      Details
                                    </span>
                                  </span>
                                  <span className="absolute inset-0 bg-[#FF914D] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 opacity-10"></span>
                                </Button>
                              </div>

                              {/* Reviews preview (collapsible) */}
                              {getItemReviews(item.id).length > 0 && (
                                <div className="mt-3 sm:mt-4">
                                  <Separator className="mb-3 sm:mb-4 bg-amber-100" />
                                  <details className="group">
                                    <summary className="flex items-center justify-between cursor-pointer list-none text-xs sm:text-sm font-medium text-amber-800">
                                      <span className="flex items-center">
                                        <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-amber-500" />
                                        Customer Reviews
                                      </span>
                                      <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 transition-transform group-open:rotate-180" />
                                    </summary>
                                    <div className="mt-3 space-y-3 text-sm text-gray-600 pt-2">
                                      {getItemReviews(item.id).map((review) => (
                                        <div
                                          key={review.id}
                                          className="p-3 bg-amber-50 rounded-lg"
                                        >
                                          <div className="flex items-center mb-1">
                                            <img
                                              src={review.avatar}
                                              alt={review.name}
                                              className="w-6 h-6 rounded-full mr-2"
                                            />
                                            <span className="font-medium text-amber-900">
                                              {review.name}
                                            </span>
                                          </div>
                                          <p className="italic line-clamp-2 text-xs">
                                            {review.review}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </details>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Mobile Swipe Hint */}
        {isMobile && processedItems.length > 0 && (
          <div className="text-center mt-6 mb-8 text-amber-600 text-sm flex flex-col items-center justify-center">
            <div className="flex items-center">
              <span>Swipe cards to explore</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="ml-1 animate-bounce rotate-90"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            <div className="mt-2 w-16 h-1.5 rounded-full bg-amber-200 flex overflow-hidden">
              <div className="w-4 h-full bg-amber-500 rounded-full animate-[scrollLeft_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Add scroll indicator animation */}
      <style jsx global>{`
        @keyframes scrollLeft {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(12px);
          }
        }

        /* Make horizontal scrolling smooth on touch devices */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        /* For touch devices - horizontal scroll behavior */
        @media (hover: none) {
          .card-scroll-container {
            scroll-snap-type: x mandatory;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .card-scroll-container > div {
            scroll-snap-align: start;
          }
        }
      `}</style>

      {/* Loading More Spinner - For Future Pagination */}
      {false && (
        <div className="flex justify-center mt-12">
          <Button
            disabled
            variant="outline"
            className="rounded-full border-amber-200 text-amber-700"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading more dishes...
          </Button>
        </div>
      )}

      {/* "Add to Cart" Floating Button - Mobile Only */}
      {isMobile && processedItems.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="h-14 w-14 rounded-full bg-primary shadow-lg cart-icon">
                  <ShoppingCart className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>View Cart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Add a custom breakpoint for extra small screens */}
      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @layer utilities {
          @variants responsive {
            /* Hide content visually but keep it accessible to screen readers */
            .sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border-width: 0;
            }
          }
        }
      `}</style>
    </section>
  );
};

export default Menu;
