import { db } from '../db/client';
import { locationPlanPoints } from '../db/schema/location-plan-points';
import { asc, eq } from 'drizzle-orm';

export const locationPlanPointsRepository = {
  async findAllByLocationId(locationId: string) {
    return db
      .select()
      .from(locationPlanPoints)
      .where(eq(locationPlanPoints.locationId, locationId))
      .orderBy(asc(locationPlanPoints.position));
  },
};
