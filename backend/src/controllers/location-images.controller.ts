import { Request, Response } from 'express';
import { locationImagesService } from '../services/location-images.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { handleWriteError } from '../utils/db-error.util';

export const locationImagesController = {
  async getAllForLocation(req: Request<{ id: string }>, res: Response) {
    try {
      const images = await locationImagesService.getImagesForLocation(req.params.id);
      res.status(200).json(images);
    } catch (error) {
      console.error('Erreur dans getAllForLocation location images:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des images.' });
    }
  },

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const image = await locationImagesService.createLocationImage(req.body);
      res.status(201).json(image);
    } catch (error) {
      handleWriteError(error, res, 'création', "l'image");
    }
  },

  async update(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const updated = await locationImagesService.updateLocationImage(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Image introuvable.' });
      }
      res.status(200).json(updated);
    } catch (error) {
      handleWriteError(error, res, 'mise à jour', "l'image");
    }
  },

  async remove(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const deleted = await locationImagesService.deleteLocationImage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Image introuvable.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erreur dans delete location image:', error);
      res.status(500).json({ message: "Une erreur est survenue lors de la suppression de l'image." });
    }
  },

  async setCover(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const updated = await locationImagesService.setCoverImage(req.params.id);
      if (!updated) {
        return res.status(404).json({ message: 'Image introuvable.' });
      }
      res.status(200).json(updated);
    } catch (error) {
      console.error('Erreur dans setCover location image:', error);
      res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour de l'image de couverture." });
    }
  },
};
