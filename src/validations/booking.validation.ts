// Install: npm install zod
import { z } from 'zod';

export const assignTechnicianSchema = z.object({
  technicianId: z
    .string({ error: 'Please select a technician' })
    .min(1, 'Please select a technician'),
});

export const updateStatusSchema = z.object({
  status: z.enum(
    [
      'PENDING',
      'CONFIRMED',
      'TECHNICIAN_ASSIGNED',
      'ON_THE_WAY',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
    ] as const,
    { error: 'Status is required' }
  ),
  technicianId: z.string().optional(),
});

export const cancelBookingSchema = z.object({
  reason: z
    .string()
    .min(5, 'Please provide a reason (min 5 characters)')
    .max(300, 'Reason must not exceed 300 characters')
    .optional(),
});

export type AssignTechnicianFormValues = z.infer<typeof assignTechnicianSchema>;
export type UpdateStatusFormValues     = z.infer<typeof updateStatusSchema>;
export type CancelBookingFormValues    = z.infer<typeof cancelBookingSchema>;
