import { z } from 'zod';
import { REGEX } from '../utils/common';

export const createCustomerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),

  phone: z
    .string()
    .trim()
    .regex(REGEX.PHONE, 'Enter a valid 10-digit Indian mobile number'),

  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER'] as const, {
    error: 'Gender is required',
  }),

  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Enter a valid date of birth')
    .refine((value) => new Date(value) <= new Date(), 'Date of birth cannot be in the future'),
});

export type CreateCustomerFormValues = z.infer<typeof createCustomerSchema>;