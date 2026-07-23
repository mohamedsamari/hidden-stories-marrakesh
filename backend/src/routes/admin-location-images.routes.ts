import { Router } from 'express';
import { locationImagesController } from '../controllers/location-images.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createLocationImageSchema, updateLocationImageSchema } from '../validators/location-image.validator';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /admin/location-images:
 *   post:
 *     summary: Associe une image (déjà uploadée) à un lieu
 *     tags: [LocationImages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationImageInput'
 *     responses:
 *       201:
 *         description: Image associée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationImage'
 *       400:
 *         description: Données invalides ou locationId inexistant
 *       401:
 *         description: Authentification requise
 */
router.post('/', validateBody(createLocationImageSchema), locationImagesController.create);

/**
 * @openapi
 * /admin/location-images/{id}:
 *   patch:
 *     summary: Met à jour une image de lieu (URL, textes alternatifs, position)
 *     tags: [LocationImages]
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
 *               position: { type: integer, minimum: 0 }
 *     responses:
 *       200:
 *         description: Image mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationImage'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Image introuvable
 *   delete:
 *     summary: Supprime une image de lieu
 *     tags: [LocationImages]
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
router.patch('/:id', validateBody(updateLocationImageSchema), locationImagesController.update);
router.delete('/:id', locationImagesController.remove);

/**
 * @openapi
 * /admin/location-images/{id}/set-cover:
 *   patch:
 *     summary: Définit cette image comme couverture du lieu (désactive la couverture précédente)
 *     tags: [LocationImages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Image définie comme couverture
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationImage'
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Image introuvable
 */
router.patch('/:id/set-cover', locationImagesController.setCover);

export default router;
