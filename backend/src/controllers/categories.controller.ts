import { Request, Response } from 'express';
import { categoriesService } from '../services/categories.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { handleWriteError } from '../utils/db-error.util';

export const categoriesController = {
  async getAll(req: Request, res: Response) {
    try {
      const categories = await categoriesService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error('Erreur dans getAll categories:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des catégories.' });
    }
  },

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const category = await categoriesService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      handleWriteError(error, res, 'création', 'la catégorie');
    }
  },

  async update(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const updated = await categoriesService.updateCategory(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Catégorie introuvable.' });
      }
      res.status(200).json(updated);
    } catch (error) {
      handleWriteError(error, res, 'mise à jour', 'la catégorie');
    }
  },

  async remove(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      const deleted = await categoriesService.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Catégorie introuvable.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erreur dans delete category:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de la catégorie.' });
    }
  },
};