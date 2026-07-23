import { Router } from 'express';
import { categoriesController } from '../controllers/categories.controller';

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Liste toutes les catégories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', categoriesController.getAll);

export default router;
