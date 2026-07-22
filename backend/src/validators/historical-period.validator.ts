import { z } from 'zod';

export const createHistoricalPeriodSchema = z.object({
  nameEn: z.string().trim().min(1).max(100),
  nameFr: z.string().trim().min(1).max(100),
});

export const updateHistoricalPeriodSchema = createHistoricalPeriodSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Au moins un champ doit être fourni pour la mise à jour.' },
);

export type CreateHistoricalPeriodInput = z.infer<typeof createHistoricalPeriodSchema>;
export type UpdateHistoricalPeriodInput = z.infer<typeof updateHistoricalPeriodSchema>;
