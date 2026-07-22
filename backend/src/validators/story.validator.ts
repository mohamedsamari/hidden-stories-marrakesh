import { z } from 'zod';

export const createStorySchema = z.object({
  titleEn: z.string().trim().min(1).max(200),
  titleFr: z.string().trim().min(1).max(200),

  shortDescriptionEn: z.string().trim().min(1).max(300),
  shortDescriptionFr: z.string().trim().min(1).max(300),

  fullStoryEn: z.string().trim().min(1),
  fullStoryFr: z.string().trim().min(1),

  coverImageUrl: z.string().trim().min(1).max(500),

  audioUrlEn: z.string().trim().min(1).max(500).optional(),
  audioUrlFr: z.string().trim().min(1).max(500).optional(),

  century: z.number().int().optional(),

  categoryId: z.string().uuid(),
  locationId: z.string().uuid(),
  historicalPeriodId: z.string().uuid().optional(),
  dynastyId: z.string().uuid().optional(),

  isPublished: z.boolean().optional(),
});

export const updateStorySchema = createStorySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Au moins un champ doit être fourni pour la mise à jour.' },
);

export type CreateStoryInput = z.infer<typeof createStorySchema>;
export type UpdateStoryInput = z.infer<typeof updateStorySchema>;
