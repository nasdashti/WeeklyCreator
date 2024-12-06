import { 
  parseISO, 
  startOfWeek, 
  endOfWeek, 
  isWithinInterval, 
  subWeeks, 
  isBefore,
  isValid,
  addDays
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

const TIMEZONE = 'Etc/GMT+12'; // UTC-12:00

export const toUTC12 = (date: Date): Date => {
  return utcToZonedTime(date, TIMEZONE);
};

export const fromUTC12 = (date: Date): Date => {
  return zonedTimeToUtc(date, TIMEZONE);
};

export const formatDateToUTC12 = (dateString: string): string => {
  const date = parseISO(dateString);
  if (!isValid(date)) return new Date().toISOString();
  const utc12Date = toUTC12(date);
  return utc12Date.toISOString();
};

export const calculateWeeklyStreak = (uploadDates: Date[], startDate: Date): number => {
  if (!uploadDates.length || !isValid(startDate)) return 0;

  // Sort dates in descending order (newest first)
  const sortedDates = [...uploadDates].sort((a, b) => b.getTime() - a.getTime());
  
  // Convert all dates to UTC-12
  const utc12Dates = sortedDates.map(date => toUTC12(date));
  const utc12StartDate = toUTC12(startDate);
  
  let streakCount = 0;
  let currentWeek = startOfWeek(toUTC12(new Date()), { weekStartsOn: 1 });
  let hasUpload = true;

  // Add one day to include the current week if there's an upload
  const adjustedCurrentWeek = addDays(currentWeek, 1);

  while (hasUpload && !isBefore(adjustedCurrentWeek, utc12StartDate)) {
    const weekEnd = endOfWeek(adjustedCurrentWeek, { weekStartsOn: 1 });
    hasUpload = utc12Dates.some(date => 
      isWithinInterval(date, { start: adjustedCurrentWeek, end: weekEnd })
    );

    if (hasUpload) {
      streakCount++;
      currentWeek = subWeeks(currentWeek, 1);
    } else {
      break;
    }
  }

  return streakCount;
};