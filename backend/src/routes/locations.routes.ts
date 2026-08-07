import { Router } from 'express';
import { locationsController } from '../controllers/locations.controller';
import { locationImagesController } from '../controllers/location-images.controller';
import { locationPlanPointsController } from '../controllers/location-plan-points.controller';

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

/**
 * @openapi
 * /locations/{id}/plan-points:
 *   get:
 *     summary: Liste les points cliquables du plan intérieur d'un lieu
 *     tags: [Locations]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Liste des points du plan (vide si le lieu n'a pas de plan légendé)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationPlanPoint'
 */
router.get('/:id/plan-points', locationPlanPointsController.getAllForLocation);

export default router;
