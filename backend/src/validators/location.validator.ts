import { z } from 'zod';

export const createLocationSchema = z.object({
  nameEn: z.string().trim().min(1).max(100),
  nameFr: z.string().trim().min(1).max(100),
  descriptionEn: z.string().trim().min(1).max(1000).optional(),
  descriptionFr: z.string().trim().min(1).max(1000).optional(),
  addressEn: z.string().trim().min(1).max(200).optional(),
  addressFr: z.string().trim().min(1).max(200).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  categoryId: z.string().uuid().optional(),
});

export const updateLocationSchema = createLocationSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Au moins un champ doit être fourni pour la mise à jour.' },
);

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
