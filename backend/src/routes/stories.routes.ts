import { Router } from 'express';
import { storiesController } from '../controllers/stories.controller';
import { storyImagesController } from '../controllers/story-images.controller';
import { storyReferencesController } from '../controllers/story-references.controller';

const router = Router();

/**
 * @openapi
 * /stories:
 *   get:
 *     summary: Liste les histoires publiées, avec filtres, tri, recherche et pagination
 *     tags: [Stories]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - name: categoryId
 *         in: query
 *         schema: { type: string, format: uuid }
 *         description: Filtre par catégorie
 *       - name: historicalPeriodId
 *         in: query
 *         schema: { type: string, format: uuid }
 *         description: Filtre par période historique
 *       - name: dynastyId
 *         in: query
 *         schema: { type: string, format: uuid }
 *         description: Filtre par dynastie
 *       - name: century
 *         in: query
 *         schema: { type: integer }
 *         description: Filtre par siècle
 *       - name: search
 *         in: query
 *         schema: { type: string }
 *         description: Recherche texte sur le titre et la description courte (EN/FR)
 *       - name: sortBy
 *         in: query
 *         schema: { type: string, enum: [titleEn, createdAt, century] }
 *         description: Champ de tri (défaut - createdAt)
 *       - name: order
 *         in: query
 *         schema: { type: string, enum: [asc, desc] }
 *         description: Ordre de tri (défaut - desc)
 *     responses:
 *       200:
 *         description: Liste des histoires publiées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Story'
 */
router.get('/', storiesController.getAll);

/**
 * @openapi
 * /stories/{id}:
 *   get:
 *     summary: Récupère le détail d'une histoire publiée
 *     tags: [Stories]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Détail de l'histoire
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       404:
 *         description: Histoire introuvable ou non publiée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', storiesController.getById);

/**
 * @openapi
 * /stories/{id}/images:
 *   get:
 *     summary: Liste les images associées à une histoire publiée
 *     tags: [Stories]
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
 *       404:
 *         description: Histoire introuvable ou non publiée
 */
router.get('/:id/images', storyImagesController.getAllForStory);

/**
 * @openapi
 * /stories/{id}/references:
 *   get:
 *     summary: Liste les références/sources associées à une histoire publiée
 *     tags: [Stories]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Liste des références de l'histoire
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoryReference'
 *       404:
 *         description: Histoire introuvable ou non publiée
 */
router.get('/:id/references', storyReferencesController.getAllForStory);

export default router;
