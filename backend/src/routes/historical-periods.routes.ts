import { Router } from 'express';
import { historicalPeriodsController } from '../controllers/historical-periods.controller';

const router = Router();

/**
 * @openapi
 * /historical-periods:
 *   get:
 *     summary: Liste toutes les périodes historiques
 *     tags: [HistoricalPeriods]
 *     responses:
 *       200:
 *         description: Liste des périodes historiques
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HistoricalPeriod'
 */
router.get('/', historicalPeriodsController.getAll);

export default router;
