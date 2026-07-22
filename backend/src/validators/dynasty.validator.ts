import { z } from 'zod';

export const createDynastySchema = z.object({
  nameEn: z.string().trim().min(1).max(100),
  nameFr: z.string().trim().min(1).max(100),
});

export const updateDynastySchema = createDynastySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Au moins un champ doit être fourni pour la mise à jour.' },
);

export type CreateDynastyInput = z.infer<typeof createDynastySchema>;
export type UpdateDynastyInput = z.infer<typeof updateDynastySchema>;
