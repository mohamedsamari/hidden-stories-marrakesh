import { Request, Response } from 'express';
import { locationsService } from '../services/locations.service';

export const locationsController = {
  async getAll(req: Request, res: Response) {
    try {
      const locations = await locationsService.getAllLocations();
      res.status(200).json(locations);
    } catch (error) {
      console.error('Erreur dans getAll locations:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des lieux.' });
    }
  },
};