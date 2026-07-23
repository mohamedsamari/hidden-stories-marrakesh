import { Router } from 'express';
import { historicalPeriodsController } from '../controllers/historical-periods.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createHistoricalPeriodSchema, updateHistoricalPeriodSchema } from '../validators/historical-period.validator';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /admin/historical-periods:
 *   post:
 *     summary: Crée une période historique
 *     tags: [HistoricalPeriods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoricalPeriodInput'
 *     responses:
 *       201:
 *         description: Période historique créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoricalPeriod'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 */
router.post('/', validateBody(createHistoricalPeriodSchema), historicalPeriodsController.create);

/**
 * @openapi
 * /admin/historical-periods/{id}:
 *   patch:
 *     summary: Met à jour une période historique
 *     tags: [HistoricalPeriods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoricalPeriodInput'
 *     responses:
 *       200:
 *         description: Période historique mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoricalPeriod'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Période historique introuvable
 *   delete:
 *     summary: Supprime une période historique
 *     tags: [HistoricalPeriods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Période historique supprimée
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Période historique introuvable
 */
router.patch('/:id', validateBody(updateHistoricalPeriodSchema), historicalPeriodsController.update);
router.delete('/:id', historicalPeriodsController.remove);

export default router;
