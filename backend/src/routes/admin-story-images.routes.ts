import { Router } from 'express';
import { storyImagesController } from '../controllers/story-images.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createStoryImageSchema, updateStoryImageSchema } from '../validators/story-image.validator';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /admin/story-images:
 *   post:
 *     summary: Associe une image (déjà uploadée) à une histoire
 *     tags: [StoryImages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoryImageInput'
 *     responses:
 *       201:
 *         description: Image associée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoryImage'
 *       400:
 *         description: Données invalides ou storyId inexistant
 *       401:
 *         description: Authentification requise
 */
router.post('/', validateBody(createStoryImageSchema), storyImagesController.create);

/**
 * @openapi
 * /admin/story-images/{id}:
 *   patch:
 *     summary: Met à jour une image de story (URL ou textes alternatifs)
 *     tags: [StoryImages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl: { type: string }
 *               altTextEn: { type: string }
 *               altTextFr: { type: string }
 *     responses:
 *       200:
 *         description: Image mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoryImage'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Image introuvable
 *   delete:
 *     summary: Supprime une image de story
 *     tags: [StoryImages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Image supprimée
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Image introuvable
 */
router.patch('/:id', validateBody(updateStoryImageSchema), storyImagesController.update);
router.delete('/:id', storyImagesController.remove);

export default router;
