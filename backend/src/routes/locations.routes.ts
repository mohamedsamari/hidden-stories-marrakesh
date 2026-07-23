import { Router } from 'express';
import { locationsController } from '../controllers/locations.controller';
import { locationImagesController } from '../controllers/location-images.controller';

const router = Router();

/**
 * @openapi
 * /locations:
 *   get:
 *     summary: Liste tous les lieux
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Liste des lieux
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
router.get('/', locationsController.getAll);

/**
 * @openapi
 * /locations/{id}/images:
 *   get:
 *     summary: Liste les images d'un lieu
 *     tags: [Locations]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Liste des images du lieu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationImage'
 */
router.get('/:id/images', locationImagesController.getAllForLocation);

export default router;
