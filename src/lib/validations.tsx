import { z } from "zod";
import { CATEGORIES } from "../utils/supabase/client";

// Auth schemas
export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Product schemas
export const productSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title must be no more than 80 characters"),
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be no more than 1000 characters"),
  category: z.enum(CATEGORIES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid category" })
  }),
  price: z.number()
    .min(0, "Price must be 0 or greater")
    .max(1000000, "Price must be less than ₹10,00,000"),
});

// Profile schema
export const profileSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

// Cart schema
export const addToCartSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().min(1, "Quantity must be at least 1").max(10, "Maximum quantity is 10"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type AddToCartFormData = z.infer<typeof addToCartSchema>;