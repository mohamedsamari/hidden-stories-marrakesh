import { Router } from 'express';
import { locationsController } from '../controllers/locations.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createLocationSchema, updateLocationSchema } from '../validators/location.validator';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /admin/locations:
 *   post:
 *     summary: Crée un lieu
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationInput'
 *     responses:
 *       201:
 *         description: Lieu créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Données invalides (ex. latitude/longitude hors bornes)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Authentification requise
 */
router.post('/', validateBody(createLocationSchema), locationsController.create);

/**
 * @openapi
 * /admin/locations/{id}:
 *   patch:
 *     summary: Met à jour un lieu
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationInput'
 *     responses:
 *       200:
 *         description: Lieu mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Lieu introuvable
 *   delete:
 *     summary: Supprime un lieu
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Lieu supprimé
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Lieu introuvable
 */
router.patch('/:id', validateBody(updateLocationSchema), locationsController.update);
router.delete('/:id', locationsController.remove);

export default router;
