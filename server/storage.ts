import { 
  MenuItem, InsertMenuItem, 
  Reservation, InsertReservation,
  ContactMessage, InsertContactMessage,
  Review, InsertReview
} from "@shared/schema";

export interface IStorage {
  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  searchMenuItems(query: string): Promise<MenuItem[]>;
  
  // Reservations
  getReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  
  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Reviews
  getReviews(): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private reservations: Map<number, Reservation>;
  private contactMessages: Map<number, ContactMessage>;
  private reviews: Map<number, Review>;
  
  private menuItemId: number;
  private reservationId: number;
  private contactMessageId: number;
  private reviewId: number;
  
  constructor() {
    this.menuItems = new Map();
    this.reservations = new Map();
    this.contactMessages = new Map();
    this.reviews = new Map();
    
    this.menuItemId = 1;
    this.reservationId = 1;
    this.contactMessageId = 1;
    this.reviewId = 1;
    
    // Initialize with sample menu items
    this.initializeMenuItems();
    this.initializeReviews();
  }
  
  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }
  
  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      (item) => item.category === category
    );
  }
  
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }
  
  async searchMenuItems(query: string): Promise<MenuItem[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.menuItems.values()).filter(
      (item) => 
        item.name.toLowerCase().includes(lowerQuery) || 
        item.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Reservations
  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }
  
  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }
  
  async createReservation(reservationData: InsertReservation): Promise<Reservation> {
    const id = this.reservationId++;
    const createdAt = new Date();
    // Ensure notes is never undefined
    const notes = reservationData.notes ?? null;
    const reservation: Reservation = { ...reservationData, notes, id, createdAt };
    this.reservations.set(id, reservation);
    return reservation;
  }
  
  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
  
  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageId++;
    const createdAt = new Date();
    const message: ContactMessage = { ...messageData, id, createdAt };
    this.contactMessages.set(id, message);
    return message;
  }
  
  // Reviews
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }
  
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const review: Review = { ...reviewData, id };
    this.reviews.set(id, review);
    return review;
  }
  
  // Initialize sample data
  private initializeMenuItems() {
    const menuItems: InsertMenuItem[] = [
      // Starters
      {
        name: "Bruschetta",
        description: "Toasted bread topped with tomatoes, garlic, and fresh basil.",
        price: "8.99",
        category: "starters",
        image: "https://images.unsplash.com/photo-1541013406133-94ed77ee8ba8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Calamari",
        description: "Crispy fried calamari rings served with marinara sauce.",
        price: "12.99", 
        category: "starters",
        image: "https://images.unsplash.com/photo-1629046068694-a63508c35f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Truffle Pasta",
        description: "Handmade pasta tossed with black truffle, wild mushrooms, and parmesan cream sauce.",
        price: "24.99",
        category: "starters",
        image: "https://images.unsplash.com/photo-1551978129-b73f45d132eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      // Main Course
      {
        name: "Grilled Salmon",
        description: "Fresh salmon fillet, grilled and served with asparagus and lemon butter sauce.",
        price: "22.99",
        category: "main",
        image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Chicken Alfredo",
        description: "Fettuccine pasta with grilled chicken and creamy Alfredo sauce.",
        price: "18.99",
        category: "main",
        image: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Wagyu Steak",
        description: "Premium Wagyu beef grilled to perfection, served with roasted vegetables and red wine reduction.",
        price: "38.99",
        category: "main",
        image: "https://images.unsplash.com/photo-1560611588-163f49a6cbe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      // Desserts
      {
        name: "Tiramisu",
        description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
        price: "9.99",
        category: "desserts",
        image: "https://images.unsplash.com/photo-1551024601-78e7d5134b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Crème Brûlée",
        description: "Rich vanilla custard topped with a layer of caramelized sugar.",
        price: "8.99",
        category: "desserts",
        image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Chocolate Lava Cake",
        description: "Decadent chocolate cake with a molten center, served with vanilla ice cream and berries.",
        price: "12.99",
        category: "desserts",
        image: "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      // Drinks
      {
        name: "House Red Wine",
        description: "Glass of our house-selected red wine, rich and full-bodied.",
        price: "7.99",
        category: "drinks",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Classic Mojito",
        description: "Refreshing cocktail with rum, mint, lime, sugar, and soda water.",
        price: "9.99",
        category: "drinks",
        image: "https://images.unsplash.com/photo-1623123095585-bfa830a89394?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      }
    ];
    
    menuItems.forEach(item => {
      const id = this.menuItemId++;
      this.menuItems.set(id, { ...item, id });
    });
  }
  
  private initializeReviews() {
    const reviews: InsertReview[] = [
      {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/23.jpg",
        rating: 5,
        review: "The food was absolutely amazing! The truffle pasta is to die for, and the service was impeccable. Will definitely be coming back soon!"
      },
      {
        name: "Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        rating: 4,
        review: "Great atmosphere and delicious food. The reservation process was smooth, and they accommodated our special requests. Highly recommend the Wagyu steak!"
      },
      {
        name: "Emily Rodriguez",
        avatar: "https://randomuser.me/api/portraits/women/67.jpg",
        rating: 5,
        review: "We celebrated our anniversary here and it was perfect! The staff made us feel special, and the chocolate lava cake was the best dessert I've ever had."
      }
    ];
    
    reviews.forEach(review => {
      const id = this.reviewId++;
      this.reviews.set(id, { ...review, id });
    });
  }
}

export const storage = new MemStorage();
