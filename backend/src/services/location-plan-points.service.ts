import { locationPlanPointsRepository } from '../repositories/location-plan-points.repository';

export const locationPlanPointsService = {
  async getPlanPointsForLocation(locationId: string) {
    return locationPlanPointsRepository.findAllByLocationId(locationId);
  },
};
