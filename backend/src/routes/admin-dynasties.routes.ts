import { Router } from 'express';
import { dynastiesController } from '../controllers/dynasties.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createDynastySchema, updateDynastySchema } from '../validators/dynasty.validator';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /admin/dynasties:
 *   post:
 *     summary: Crée une dynastie
 *     tags: [Dynasties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DynastyInput'
 *     responses:
 *       201:
 *         description: Dynastie créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dynasty'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 */
router.post('/', validateBody(createDynastySchema), dynastiesController.create);

/**
 * @openapi
 * /admin/dynasties/{id}:
 *   patch:
 *     summary: Met à jour une dynastie
 *     tags: [Dynasties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DynastyInput'
 *     responses:
 *       200:
 *         description: Dynastie mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dynasty'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Dynastie introuvable
 *   delete:
 *     summary: Supprime une dynastie
 *     tags: [Dynasties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Dynastie supprimée
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Dynastie introuvable
 */
router.patch('/:id', validateBody(updateDynastySchema), dynastiesController.update);
router.delete('/:id', dynastiesController.remove);

export default router;
