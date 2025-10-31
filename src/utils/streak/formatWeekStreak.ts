import { parseISO, startOfWeek, addDays, format, getDay } from "date-fns";

export const formatWeekStreak = (
  completedDates: Set<string>,
  todayString: string
): Record<string, [string, string]> => {
  const today = parseISO(todayString);
  const dayOfWeek = getDay(today); // 0 = Sunday
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 });

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const weekStatus: Record<string, [string, string]> = {};

  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(startOfWeekDate, i);
    const dateString = format(currentDay, "d");

    let status: string;

    if (i < dayOfWeek) {
      status = completedDates.has(format(currentDay, "yyyy-MM-dd"))
        ? "completed"
        : "incompleted";
    } else if (i === dayOfWeek) {
      status = completedDates.has(format(currentDay, "yyyy-MM-dd"))
        ? "completed"
        : "today";
    } else {
      status = "not available";
    }

    weekStatus[dateString] = [daysOfWeek[i], status];
  }

  return weekStatus;
};
