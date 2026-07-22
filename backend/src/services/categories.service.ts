import { categoriesRepository } from '../repositories/categories.repository';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

export const categoriesService = {
  async getAllCategories() {
    return categoriesRepository.findAll();
  },

  async createCategory(data: CreateCategoryInput) {
    return categoriesRepository.create(data);
  },

  async updateCategory(id: string, data: UpdateCategoryInput) {
    return categoriesRepository.update(id, data);
  },

  async deleteCategory(id: string) {
    return categoriesRepository.remove(id);
  },
};