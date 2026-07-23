import { z } from 'zod';

export const createStoryImageSchema = z.object({
  storyId: z.string().uuid(),
  imageUrl: z.string().trim().min(1).max(500),
  altTextEn: z.string().trim().min(1).max(200).optional(),
  altTextFr: z.string().trim().min(1).max(200).optional(),
});

export const updateStoryImageSchema = z
  .object({
    imageUrl: z.string().trim().min(1).max(500).optional(),
    altTextEn: z.string().trim().min(1).max(200).optional(),
    altTextFr: z.string().trim().min(1).max(200).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ doit être fourni pour la mise à jour.',
  });

export type CreateStoryImageInput = z.infer<typeof createStoryImageSchema>;
export type UpdateStoryImageInput = z.infer<typeof updateStoryImageSchema>;
