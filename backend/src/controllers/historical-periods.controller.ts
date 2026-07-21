import { Request, Response } from 'express';
import { historicalPeriodsService } from '../services/historical-periods.service';

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
};