import { Request, Response } from 'express';
import { historicalPeriodsService } from '../services/historical-periods.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { handleWriteError } from '../utils/db-error.util';

export const historicalPeriodsController = {
  async getAll(req: Request, res: Response) {
    try {
      const periods = await historicalPeriodsService.getAllPeriods();
      res.status(200).json(periods);
    } catch (error) {
      console.error('Erreur dans getAll historical periods:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des périodes historiques.' });
    }
  },

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const period = await historicalPeriodsService.createPeriod(req.body);
      res.status(201).json(period);
    } catch (error) {
      handleWriteError(error, res, 'création', 'la période historique');
    }
  },

  async update(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const updated = await historicalPeriodsService.updatePeriod(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Période historique introuvable.' });
      }
      res.status(200).json(updated);
    } catch (error) {
      handleWriteError(error, res, 'mise à jour', 'la période historique');
    }
  },

  async remove(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const deleted = await historicalPeriodsService.deletePeriod(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Période historique introuvable.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erreur dans delete historical period:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de la période historique.' });
    }
  },
};