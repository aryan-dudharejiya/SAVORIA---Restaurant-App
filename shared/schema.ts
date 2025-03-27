import { pgTable, text, serial, integer, boolean, timestamp, numeric, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Menu Item
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // 'starters', 'main', 'desserts', 'drinks'
  image: text("image").notNull(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

// Reservation
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: text("guests").notNull(),
  notes: text("notes").default(''),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
});

// Contact Message
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  rating: integer("rating").notNull(),
  review: text("review").notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
});

// Order Status Enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
]);

// Payment Method Enum
export const paymentMethodEnum = pgEnum("payment_method", [
  "upi",
  "cod",
]);

// Payment Status Enum
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
]);

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  trackingId: text("tracking_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  notes: text("notes").default(''),
  items: json("items").notNull(),  // Cart items stored as JSON
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, out_for_delivery, delivered
  paymentMethod: text("payment_method").notNull(), // upi, cod
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed
  estimatedDeliveryTime: text("estimated_delivery_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Cart Item (for in-memory use only)
export const cartItemSchema = z.object({
  id: z.number(),
  menuItemId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  image: z.string().optional(),
});

// Checkout Form Schema
export const checkoutFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["upi", "cod"], {
    required_error: "Please select a payment method",
  }),
});

// Export types
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
