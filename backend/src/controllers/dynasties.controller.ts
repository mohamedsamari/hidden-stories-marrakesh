import { Request, Response } from 'express';
import { dynastiesService } from '../services/dynasties.service';

export const dynastiesController = {
  async getAll(req: Request, res: Response) {
    try {
      const dynasties = await dynastiesService.getAllDynasties();
      res.status(200).json(dynasties);
    } catch (error) {
      console.error('Erreur dans getAll dynasties:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des dynasties.' });
    }
  },
};