import { z } from 'zod';
import { REGEX } from '../utils/common';

export const adminLoginSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .email('Enter a valid email address')
    .trim()
    .toLowerCase(),

  password: z
    .string({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        REGEX.PASSWORD,
        'Password must contain uppercase, lowercase, and a number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type AdminLoginFormValues      = z.infer<typeof adminLoginSchema>;
export type ChangePasswordFormValues  = z.infer<typeof changePasswordSchema>;
