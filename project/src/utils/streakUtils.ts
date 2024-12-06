import { parseISO, startOfWeek, endOfWeek, isWithinInterval, subWeeks } from 'date-fns';
import { Video } from '../types/channel';

export function calculateStreak(videos: Video[], type: 'videos' | 'shorts'): number {
  if (!videos?.length) return 0;

  // Filter videos based on type
  const filteredVideos = videos.filter(video => 
    type === 'shorts' ? video.isShort : !video.isShort
  );

  if (!filteredVideos.length) return 0;

  const uploadDates = filteredVideos
    .map(v => parseISO(v.publishedAt))
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

  // Start counting streak from the most recent upload week
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