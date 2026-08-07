export interface DaySchedule {
  open: string;
  close: string;
}

export interface OpeningHours {
  monday: DaySchedule | null;
  tuesday: DaySchedule | null;
  wednesday: DaySchedule | null;
  thursday: DaySchedule | null;
  friday: DaySchedule | null;
  saturday: DaySchedule | null;
  sunday: DaySchedule | null;
}

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
  openingHours: OpeningHours | null;
  isFreeEntry: boolean;
  entryPriceLabel: string | null;
  planImageUrl: string | null;
  createdAt: string;
}
