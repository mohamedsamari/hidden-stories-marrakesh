export interface LocationPlanPoint {
  id: string;
  locationId: string;
  xPercent: number;
  yPercent: number;
  labelEn: string;
  labelFr: string;
  descriptionEn: string | null;
  descriptionFr: string | null;
  position: number;
  createdAt: string;
}
