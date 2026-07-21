import { db } from '../db/client';
import { historicalPeriods } from '../db/schema/historical-periods';

export const historicalPeriodsRepository = {
  async findAll() {
    return db.select().from(historicalPeriods);
  },
};