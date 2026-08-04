export interface Location {
  id: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string | null;
  descriptionFr: string | null;
  addressEn: string | null;
  addressFr: string | null;
  latitude: number;
  longitude: number;
  categoryId: string | null;
  createdAt: string;
}
