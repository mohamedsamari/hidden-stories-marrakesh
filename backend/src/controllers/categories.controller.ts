import { Request, Response } from 'express';
import { categoriesService } from '../services/categories.service';

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
};