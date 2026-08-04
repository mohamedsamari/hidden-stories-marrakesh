import { Router } from 'express';
import { storiesController } from '../controllers/stories.controller';
import { storyImagesController } from '../controllers/story-images.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createStorySchema, updateStorySchema } from '../validators/story.validator';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /admin/stories:
 *   get:
 *     summary: Liste toutes les histoires (publiées et brouillons)
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - name: categoryId
 *         in: query
 *         schema: { type: string, format: uuid }
 *       - name: historicalPeriodId
 *         in: query
 *         schema: { type: string, format: uuid }
 *       - name: dynastyId
 *         in: query
 *         schema: { type: string, format: uuid }
 *       - name: century
 *         in: query
 *         schema: { type: integer }
 *       - name: search
 *         in: query
 *         schema: { type: string }
 *       - name: sortBy
 *         in: query
 *         schema: { type: string, enum: [titleEn, createdAt, century] }
 *       - name: order
 *         in: query
 *         schema: { type: string, enum: [asc, desc] }
 *       - name: isPublished
 *         in: query
 *         schema: { type: boolean }
 *         description: Filtre explicite sur le statut de publication (absent - tous statuts confondus)
 *     responses:
 *       200:
 *         description: Liste des histoires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Story'
 *       401:
 *         description: Authentification requise
 *   post:
 *     summary: Crée une histoire (brouillon par défaut)
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoryInput'
 *     responses:
 *       201:
 *         description: Histoire créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       400:
 *         description: Données invalides ou référence (categoryId/locationId) inexistante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Authentification requise
 */
router.get('/', storiesController.getAllAdmin);

/**
 * @openapi
 * /admin/stories/{id}:
 *   get:
 *     summary: Récupère une histoire quel que soit son statut de publication
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Détail de l'histoire
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Histoire introuvable
 *   patch:
 *     summary: Met à jour une histoire (partiel)
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoryUpdateInput'
 *     responses:
 *       200:
 *         description: Histoire mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Histoire introuvable
 *   delete:
 *     summary: Supprime une histoire
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Histoire supprimée
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Histoire introuvable
 */
router.get('/:id', storiesController.getByIdAdmin);
router.post('/', validateBody(createStorySchema), storiesController.create);
router.patch('/:id', validateBody(updateStorySchema), storiesController.update);
router.delete('/:id', storiesController.remove);

/**
 * @openapi
 * /admin/stories/{id}/images:
 *   get:
 *     summary: Liste les images d'une histoire, publiée ou non
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Liste des images de l'histoire
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoryImage'
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Histoire introuvable
 */
router.get('/:id/images', storyImagesController.getAllForStoryAdmin);

/**
 * @openapi
 * /admin/stories/{id}/publish:
 *   patch:
 *     summary: Publie une histoire (la rend visible côté public)
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Histoire publiée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Histoire introuvable
 */
router.patch('/:id/publish', storiesController.publish);

/**
 * @openapi
 * /admin/stories/{id}/unpublish:
 *   patch:
 *     summary: Dépublie une histoire (redevient un brouillon)
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Histoire dépubliée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Histoire introuvable
 */
router.patch('/:id/unpublish', storiesController.unpublish);

export default router;
