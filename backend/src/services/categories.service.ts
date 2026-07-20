import { categoriesRepository } from '../repositories/categories.repository';

export const categoriesService = {
  async getAllCategories() {
    return categoriesRepository.findAll();
  },
};