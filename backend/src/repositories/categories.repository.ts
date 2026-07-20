import { db } from '../db/client';
import { categories } from '../db/schema/categories';

export const categoriesRepository = {
  async findAll() {
    return db.select().from(categories);
  },
};