import { Request, Response } from 'express';
import { locationsService } from '../services/locations.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { handleWriteError } from '../utils/db-error.util';

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

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const location = await locationsService.createLocation(req.body);
      res.status(201).json(location);
    } catch (error) {
      handleWriteError(error, res, 'création', 'le lieu');
    }
  },

  async update(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const updated = await locationsService.updateLocation(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Lieu introuvable.' });
      }
      res.status(200).json(updated);
    } catch (error) {
      handleWriteError(error, res, 'mise à jour', 'le lieu');
    }
  },

  async remove(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const deleted = await locationsService.deleteLocation(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Lieu introuvable.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erreur dans delete location:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du lieu.' });
    }
  },
};