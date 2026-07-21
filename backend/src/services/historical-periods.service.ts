import { historicalPeriodsRepository } from '../repositories/historical-periods.repository';

export const historicalPeriodsService = {
  async getAllPeriods() {
    return historicalPeriodsRepository.findAll();
  },
};