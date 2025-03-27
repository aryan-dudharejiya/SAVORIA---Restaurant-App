import { z } from "zod";
import { insertReservationSchema, insertContactMessageSchema } from "@shared/schema";

// Extend reservation schema with client-side validation
export const reservationFormSchema = insertReservationSchema.extend({
  date: z.string()
    .min(1, "Please select a date")
    .refine(
      (date) => {
        const selected = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
      },
      { message: "Date cannot be in the past" }
    ),
  time: z.string().min(1, "Please select a time"),
  guests: z.string().min(1, "Please select number of guests"),
});

// Extend contact message schema with client-side validation
export const contactFormSchema = insertContactMessageSchema.extend({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message cannot exceed 500 characters"),
});
