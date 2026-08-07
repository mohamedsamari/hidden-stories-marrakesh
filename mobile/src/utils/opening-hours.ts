import { Language } from '@/contexts/language-context';
import { DaySchedule, OpeningHours } from '@/types/location';

const DAY_KEYS: (keyof OpeningHours)[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_LABELS: Record<keyof OpeningHours, { en: string; fr: string }> = {
  monday: { en: 'Monday', fr: 'Lundi' },
  tuesday: { en: 'Tuesday', fr: 'Mardi' },
  wednesday: { en: 'Wednesday', fr: 'Mercredi' },
  thursday: { en: 'Thursday', fr: 'Jeudi' },
  friday: { en: 'Friday', fr: 'Vendredi' },
  saturday: { en: 'Saturday', fr: 'Samedi' },
  sunday: { en: 'Sunday', fr: 'Dimanche' },
};

// JS's Date#getDay() is 0 (Sunday) to 6 (Saturday) — remap to our Monday-first keys.
const JS_DAY_TO_KEY: (keyof OpeningHours)[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

function isWithinSchedule(schedule: DaySchedule, now: Date): boolean {
  const [openH, openM] = schedule.open.split(':').map(Number);
  const [closeH, closeM] = schedule.close.split(':').map(Number);
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  return minutesNow >= openH * 60 + openM && minutesNow < closeH * 60 + closeM;
}

export function isOpenNow(hours: OpeningHours | null): boolean | null {
  if (!hours) return null;
  const now = new Date();
  const todaySchedule = hours[JS_DAY_TO_KEY[now.getDay()]];
  if (!todaySchedule) return false;
  return isWithinSchedule(todaySchedule, now);
}

export interface DayScheduleRow {
  dayLabel: string;
  hoursLabel: string;
  isToday: boolean;
}

export function formatWeekSchedule(hours: OpeningHours, language: Language): DayScheduleRow[] {
  const todayKey = JS_DAY_TO_KEY[new Date().getDay()];

  return DAY_KEYS.map((key) => {
    const schedule = hours[key];
    return {
      dayLabel: DAY_LABELS[key][language],
      hoursLabel: schedule
        ? `${schedule.open} – ${schedule.close}`
        : language === 'fr'
          ? 'Fermé'
          : 'Closed',
      isToday: key === todayKey,
    };
  });
}
