export interface Story {
  id: string
  titleEn: string
  titleFr: string
  shortDescriptionEn: string
  shortDescriptionFr: string
  fullStoryEn: string
  fullStoryFr: string
  coverImageUrl: string
  audioUrlEn: string | null
  audioUrlFr: string | null
  century: number | null
  categoryId: string
  locationId: string
  historicalPeriodId: string | null
  dynastyId: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}
