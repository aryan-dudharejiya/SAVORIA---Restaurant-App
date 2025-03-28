import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@shared/schema";

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["/api/menu"]
  });
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  
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
  
  const filteredItems = menuItems?.filter((item: MenuItem) => {
    const matchesSearch = 
      searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group menu items by category
  const groupedItems = filteredItems?.reduce((acc: Record<string, MenuItem[]>, item: MenuItem) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  
  const categoryTitles: Record<string, string> = {
    starters: "Starters",
    main: "Main Course",
    desserts: "Desserts",
    drinks: "Drinks"
  };
  
  return (
    <section id="menu" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-accent text-primary text-3xl">Explore</p>
          <h2 className="font-heading text-4xl font-bold mt-2 mb-4">Our Menu</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Discover our delicious options prepared with fresh, high-quality ingredients.
          </p>
        </div>
        
        {/* Search & Filter */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Input
                type="text"
                placeholder="Search our menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-10 border border-gray-300 rounded-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="py-3 px-4 border border-gray-300 rounded-lg">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="starters">Starters</SelectItem>
                <SelectItem value="main">Main Course</SelectItem>
                <SelectItem value="desserts">Desserts</SelectItem>
                <SelectItem value="drinks">Drinks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Menu Categories */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="p-4 flex animate-pulse">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 flex-grow">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-28"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredItems?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No menu items found matching your search criteria.</p>
          </div>
        ) : (
          Object.entries(groupedItems || {}).map(([category, items]) => (
            <div key={category} className="mb-16">
              <h3 className="font-heading text-2xl font-bold mb-6" id={`${category}-heading`}>
                {categoryTitles[category]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-category={category}>
                {items.map((item: MenuItem) => (
                  <Card key={item.id} className="p-4 flex shadow-md hover:shadow-lg transition-all">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-heading font-bold">{item.name}</h4>
                        <span className="font-medium text-primary">
                          ${parseFloat(item.price.toString()).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <Button 
                        className="mt-2 bg-primary hover:bg-primary/90 text-white px-4 py-1 rounded-full text-sm"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Menu;
