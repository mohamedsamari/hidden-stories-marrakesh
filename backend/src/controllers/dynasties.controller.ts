import { Request, Response } from 'express';
import { dynastiesService } from '../services/dynasties.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { handleWriteError } from '../utils/db-error.util';

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

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const dynasty = await dynastiesService.createDynasty(req.body);
      res.status(201).json(dynasty);
    } catch (error) {
      handleWriteError(error, res, 'création', 'la dynastie');
    }
  },

  async update(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const updated = await dynastiesService.updateDynasty(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Dynastie introuvable.' });
      }
      res.status(200).json(updated);
    } catch (error) {
      handleWriteError(error, res, 'mise à jour', 'la dynastie');
    }
  },

  async remove(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const deleted = await dynastiesService.deleteDynasty(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Dynastie introuvable.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erreur dans delete dynasty:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de la dynastie.' });
    }
  },
};