import { historicalPeriodsRepository } from '../repositories/historical-periods.repository';
import { CreateHistoricalPeriodInput, UpdateHistoricalPeriodInput } from '../validators/historical-period.validator';

export const historicalPeriodsService = {
  async getAllPeriods() {
    return historicalPeriodsRepository.findAll();
  },

  async createPeriod(data: CreateHistoricalPeriodInput) {
    return historicalPeriodsRepository.create(data);
  },

  async updatePeriod(id: string, data: UpdateHistoricalPeriodInput) {
    return historicalPeriodsRepository.update(id, data);
  },

  async deletePeriod(id: string) {
    return historicalPeriodsRepository.remove(id);
  },
};