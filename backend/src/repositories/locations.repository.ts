import { db } from '../db/client';
import { locations } from '../db/schema/locations';

export const locationsRepository = {
  async findAll() {
    return db.select().from(locations);
  },
};