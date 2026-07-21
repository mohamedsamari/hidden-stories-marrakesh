import { db } from '../db/client';
import { dynasties } from '../db/schema/dynasties';

export const dynastiesRepository = {
  async findAll() {
    return db.select().from(dynasties);
  },
};