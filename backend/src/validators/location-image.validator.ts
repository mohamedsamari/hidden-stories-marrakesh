import { z } from 'zod';

// isCover is deliberately not settable here — it's only changed via the
// dedicated /set-cover endpoint, which atomically unsets any previous cover
// for the same location. Allowing it here could leave two images marked
// as cover at once.
export const createLocationImageSchema = z.object({
  locationId: z.string().uuid(),
  imageUrl: z.string().trim().min(1).max(500),
  altTextEn: z.string().trim().min(1).max(200).optional(),
  altTextFr: z.string().trim().min(1).max(200).optional(),
  position: z.number().int().min(0).optional(),
});

export const updateLocationImageSchema = z
  .object({
    imageUrl: z.string().trim().min(1).max(500).optional(),
    altTextEn: z.string().trim().min(1).max(200).optional(),
    altTextFr: z.string().trim().min(1).max(200).optional(),
    position: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ doit être fourni pour la mise à jour.',
  });

export type CreateLocationImageInput = z.infer<typeof createLocationImageSchema>;
export type UpdateLocationImageInput = z.infer<typeof updateLocationImageSchema>;
