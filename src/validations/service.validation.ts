// Install: npm install zod
import { z } from 'zod';

export const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),

  categoryId: z
    .string()
    .min(1, 'Category is required'),

  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),

  price: z
    .number()
    .positive('Price must be greater than 0')
    .max(100_000, 'Price seems too high'),

  duration: z
    .number()
    .int('Duration must be whole minutes')
    .positive('Duration must be greater than 0')
    .max(480, 'Duration must not exceed 8 hours (480 min)'),

  emoji: z
    .string()
    .trim()
    .min(1, 'Emoji is required'),

  warranty: z.string().optional(),
  popular:  z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must not exceed 80 characters'),

  emoji:       z.string().trim().min(1, 'Emoji is required'),
  description: z.string().trim().min(5, 'Description is required'),
  color:       z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Enter a valid hex colour (e.g. #1A73E8)'),
});

export const technicianSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters'),

  phone: z
    .string()
    .length(10, 'Phone number must be 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number'),

  email: z.string().email('Enter a valid email').optional().or(z.literal('')),

  experience: z
    .number()
    .int()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience seems too high'),

  specializations: z
    .array(z.string())
    .min(1, 'Select at least one specialization'),
});

export type ServiceFormValues     = z.infer<typeof serviceSchema>;
export type CategoryFormValues    = z.infer<typeof categorySchema>;
export type TechnicianFormValues  = z.infer<typeof technicianSchema>;
