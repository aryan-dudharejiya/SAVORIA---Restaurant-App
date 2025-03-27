import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertReservationSchema, 
  insertContactMessageSchema, 
  insertOrderSchema,
  checkoutFormSchema,
  Order
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import Stripe from "stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefix with /api
  
  // Get all menu items
  app.get("/api/menu", async (req, res) => {
    try {
      const menuItems = await storage.getMenuItems();
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  
  // Get menu items by category
  app.get("/api/menu/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const menuItems = await storage.getMenuItemsByCategory(category);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });
  
  // Get a specific menu item
  app.get("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const menuItem = await storage.getMenuItem(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });
  
  // Search menu items
  app.get("/api/menu/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const menuItems = await storage.searchMenuItems(query);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to search menu items" });
    }
  });
  
  // Create a reservation
  app.post("/api/reservations", async (req, res) => {
    try {
      const validationResult = insertReservationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const reservation = await storage.createReservation(validationResult.data);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(500).json({ message: "Failed to create reservation" });
    }
  });
  
  // Get all reservations (for admin purposes)
  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });
  
  // Create a contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const validationResult = insertContactMessageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const message = await storage.createContactMessage(validationResult.data);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Get all reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
