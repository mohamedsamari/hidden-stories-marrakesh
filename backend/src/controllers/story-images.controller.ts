import { Request, Response } from 'express';
import { storyImagesService } from '../services/story-images.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { handleWriteError } from '../utils/db-error.util';

export const storyImagesController = {
  async getAllForStory(req: Request<{ id: string }>, res: Response) {
    try {
      const images = await storyImagesService.getImagesForPublishedStory(req.params.id);
      if (images === null) {
        return res.status(404).json({ message: 'Histoire introuvable.' });
      }
      res.status(200).json(images);
    } catch (error) {
      console.error('Erreur dans getAllForStory story images:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des images.' });
    }
  },

  async getAllForStoryAdmin(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const images = await storyImagesService.getImagesForStoryAdmin(req.params.id);
      if (images === null) {
        return res.status(404).json({ message: 'Histoire introuvable.' });
      }
      res.status(200).json(images);
    } catch (error) {
      console.error('Erreur dans getAllForStoryAdmin story images:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des images.' });
    }
  },

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const image = await storyImagesService.createStoryImage(req.body);
      res.status(201).json(image);
    } catch (error) {
      handleWriteError(error, res, 'création', "l'image");
    }
  },

  async update(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const updated = await storyImagesService.updateStoryImage(req.params.id, req.body);
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
      const deleted = await storyImagesService.deleteStoryImage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Image introuvable.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erreur dans delete story image:', error);
      res.status(500).json({ message: "Une erreur est survenue lors de la suppression de l'image." });
    }
  },
};
