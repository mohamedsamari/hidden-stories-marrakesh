import { Router } from 'express';
import { dynastiesController } from '../controllers/dynasties.controller';

const router = Router();

/**
 * @openapi
 * /dynasties:
 *   get:
 *     summary: Liste toutes les dynasties
 *     tags: [Dynasties]
 *     responses:
 *       200:
 *         description: Liste des dynasties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dynasty'
 */
router.get('/', dynastiesController.getAll);

export default router;
