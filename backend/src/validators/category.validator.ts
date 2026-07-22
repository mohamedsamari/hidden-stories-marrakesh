import { z } from 'zod';

export const createCategorySchema = z.object({
  nameEn: z.string().trim().min(1).max(100),
  nameFr: z.string().trim().min(1).max(100),
});

export const updateCategorySchema = createCategorySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Au moins un champ doit être fourni pour la mise à jour.' },
);

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
