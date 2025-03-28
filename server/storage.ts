import { 
  MenuItem, InsertMenuItem, 
  Reservation, InsertReservation,
  ContactMessage, InsertContactMessage,
  Review, InsertReview,
  Order, InsertOrder, CartItem
} from "@shared/schema";
import crypto from 'crypto';

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
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByTrackingId(trackingId: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined>;
  getOrdersByPhoneNumber(phoneNumber: string): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private reservations: Map<number, Reservation>;
  private contactMessages: Map<number, ContactMessage>;
  private reviews: Map<number, Review>;
  private orders: Map<number, Order>;
  
  private menuItemId: number;
  private reservationId: number;
  private contactMessageId: number;
  private reviewId: number;
  private orderId: number;
  
  constructor() {
    this.menuItems = new Map();
    this.reservations = new Map();
    this.contactMessages = new Map();
    this.reviews = new Map();
    this.orders = new Map();
    
    this.menuItemId = 1;
    this.reservationId = 1;
    this.contactMessageId = 1;
    this.reviewId = 1;
    this.orderId = 1;
    
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
  
  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrderByTrackingId(trackingId: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      order => order.trackingId === trackingId
    );
  }
  
  async getOrdersByPhoneNumber(phoneNumber: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.phoneNumber === phoneNumber
    );
  }
  
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    
    // Always generate a tracking ID regardless of whether one was provided
    const trackingId = this.generateTrackingId();
    
    // Calculate estimated delivery time (30-45 minutes from now)
    const randomMinutes = Math.floor(Math.random() * 15) + 30; // Random between 30-45
    const deliveryDate = new Date();
    deliveryDate.setMinutes(deliveryDate.getMinutes() + randomMinutes);
    
    const estimatedDeliveryTime = orderData.estimatedDeliveryTime || 
      `${deliveryDate.getHours()}:${String(deliveryDate.getMinutes()).padStart(2, '0')}`;
    
    // Ensure notes is never undefined
    const notes = orderData.notes ?? '';
    
    // Ensure required fields have default values
    const status = orderData.status || 'pending';
    const paymentStatus = orderData.paymentStatus || 'pending';
    const paymentMethod = orderData.paymentMethod || 'cod';
    
    // Make sure we have a valid totalAmount
    const totalAmount = orderData.totalAmount || '0';
    
    const order: Order = {
      ...orderData,
      id,
      notes,
      status,
      paymentStatus,
      paymentMethod,
      totalAmount,
      trackingId,
      estimatedDeliveryTime,
      createdAt,
      updatedAt
    };
    
    this.orders.set(id, order);
    console.log(`Created new order with tracking ID: ${trackingId}`);
    
    return order;
  }
  
  async updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    
    if (!order) {
      return undefined;
    }
    
    const updatedOrder = {
      ...order,
      ...updates,
      updatedAt: new Date()
    };
    
    this.orders.set(id, updatedOrder);
    
    return updatedOrder;
  }
  
  private generateTrackingId(): string {
    // Generate a unique tracking ID (e.g., SAV-1234-ABCD)
    const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `SAV-${this.orderId}-${randomPart}`;
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
      {
        name: "Shrimp Cocktail",
        description: "Jumbo shrimp served with our signature cocktail sauce and lemon wedges.",
        price: "16.99",
        category: "starters",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Spinach Artichoke Dip",
        description: "Creamy blend of spinach, artichokes, and melted cheeses, served with toasted bread.",
        price: "10.99",
        category: "starters",
        image: "https://images.unsplash.com/photo-1576300292702-bb2af0d5fd4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
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
      {
        name: "Seafood Paella",
        description: "Traditional Spanish rice dish with shrimp, mussels, clams, and saffron.",
        price: "29.99",
        category: "main",
        image: "https://images.unsplash.com/photo-1630175858099-301b0b3b2ed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Lamb Chops",
        description: "Herb-crusted lamb chops with mint jelly and roasted potatoes.",
        price: "32.99",
        category: "main",
        image: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Vegetarian Risotto",
        description: "Creamy Arborio rice with seasonal vegetables, parmesan cheese, and truffle oil.",
        price: "19.99",
        category: "main",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      // Desserts
      {
        name: "Tiramisu",
        description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
        price: "9.99",
        category: "desserts",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Crème Brûlée",
        description: "Rich vanilla custard topped with a layer of caramelized sugar.",
        price: "8.99",
        category: "desserts",
        image: "https://images.unsplash.com/photo-1534767854069-14a57f75c2f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Chocolate Lava Cake",
        description: "Decadent chocolate cake with a molten center, served with vanilla ice cream and berries.",
        price: "12.99",
        category: "desserts",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Cheesecake",
        description: "New York style cheesecake with a graham cracker crust and fresh berry compote.",
        price: "11.99",
        category: "desserts",
        image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Gelato Selection",
        description: "Choice of three scoops of our house-made gelato with biscotti.",
        price: "7.99",
        category: "desserts",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
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
      },
      {
        name: "Craft Beer Flight",
        description: "Selection of four local craft beers, served in tasting glasses.",
        price: "12.99",
        category: "drinks",
        image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Sparkling Prosecco",
        description: "Glass of crisp, dry Italian prosecco with delicate bubbles.",
        price: "8.99",
        category: "drinks",
        image: "https://images.unsplash.com/photo-1585985750376-3ea447d9dc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Espresso Martini",
        description: "Cocktail made with vodka, coffee liqueur, and freshly brewed espresso.",
        price: "11.99",
        category: "drinks",
        image: "https://images.unsplash.com/photo-1620088676099-c496e35cbbb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
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
      },
      {
        name: "David Martinez",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        review: "The seafood paella is simply outstanding! Fresh ingredients and authentic flavor. The service was attentive and the ambiance was perfect for our family dinner."
      },
      {
        name: "Sophia Williams",
        avatar: "https://randomuser.me/api/portraits/women/42.jpg",
        rating: 4,
        review: "Love the craft beer selection and the lamb chops were cooked to perfection. The only reason for 4 stars instead of 5 is that we had to wait a bit for our table despite having reservations."
      },
      {
        name: "James Wilson",
        avatar: "https://randomuser.me/api/portraits/men/58.jpg",
        rating: 5,
        review: "I'm a regular here and the consistency is remarkable. The espresso martini pairs perfectly with their tiramisu for a delightful end to any meal. Highly recommended!"
      },
      {
        name: "Olivia Taylor",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        rating: 5,
        review: "As a vegetarian, I was thrilled with their risotto. It's rare to find a restaurant that pays such attention to vegetarian options. The flavors were complex and satisfying."
      },
      {
        name: "Robert Garcia",
        avatar: "https://randomuser.me/api/portraits/men/21.jpg",
        rating: 4,
        review: "The calamari appetizer was extremely tender and the dipping sauce was a perfect complement. We enjoyed the whole dining experience, especially the attentive staff."
      },
      {
        name: "Emma Nelson",
        avatar: "https://randomuser.me/api/portraits/women/19.jpg",
        rating: 5,
        review: "We came for brunch and were blown away by the quality. The mimosas were perfectly balanced and the shrimp cocktail was the freshest I've had in years. Can't wait to return!"
      }
    ];
    
    reviews.forEach(review => {
      const id = this.reviewId++;
      this.reviews.set(id, { ...review, id });
    });
  }
}

export const storage = new MemStorage();
