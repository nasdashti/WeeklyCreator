import { parseISO, startOfWeek, endOfWeek, isWithinInterval, subWeeks } from 'date-fns';
import { Channel } from '@/types/channel';

export function calculateStreak(channel: Channel): number {
  if (!channel.videos?.length) return 0;

  const uploadDates = channel.videos
    .map(video => parseISO(video.publishedAt))
    .sort((a, b) => b.getTime() - a.getTime());

  const now = new Date();
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const lastWeekStart = subWeeks(currentWeekStart, 1);
  const lastWeekEnd = endOfWeek(lastWeekStart, { weekStartsOn: 1 });

  // Check if there's an upload in the current week
  const hasCurrentWeekUpload = uploadDates.some(date =>
    isWithinInterval(date, { start: currentWeekStart, end: currentWeekEnd })
  );

  // Check if there's an upload in the last week
  const hasLastWeekUpload = uploadDates.some(date =>
    isWithinInterval(date, { start: lastWeekStart, end: lastWeekEnd })
  );

  // If no upload in current or last week, streak is broken
  if (!hasCurrentWeekUpload && !hasLastWeekUpload) {
    return 0;
  }

  let streakCount = 0;
  let weekStart = hasCurrentWeekUpload ? currentWeekStart : lastWeekStart;
  let continueChecking = true;

  while (continueChecking && uploadDates.length > 0) {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const hasUploadThisWeek = uploadDates.some(date =>
      isWithinInterval(date, { start: weekStart, end: weekEnd })
    );

    if (hasUploadThisWeek) {
      streakCount++;
      weekStart = subWeeks(weekStart, 1);
    } else {
      continueChecking = false;
    }
  }

  return streakCount;
}

export function isStreakActive(channel: Channel): boolean {
  return channel.streak.current > 0;
}