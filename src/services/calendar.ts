import { CalendarEvent } from '@/types';
import { zonedTimeToUtc } from 'date-fns-tz';
import { get1823PublicHolidays, set1823PublicHolidays } from '../helpers/redis';

async function getCalendar() {
  const calendar = await get1823PublicHolidays();
  if (calendar) {
    return calendar;
  }
  const res = await fetch('https://www.1823.gov.hk/common/ical/en.json');
  if (!res.ok) {
    throw new Error('failed to fetch the iCalendar from 1823 Gov HK');
  }
  const _calendar = await res.json();
  await set1823PublicHolidays(_calendar);
  return _calendar;
}

/**
 * get `https://www.1823.gov.hk/common/ical/en.json` JSON response and parse to calendar events
 */
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const calendar = await getCalendar();
  const events: CalendarEvent[] = [];
  const timeZone = calendar.vcalendar[0]['x-wr-timezone'];

  for (const event of calendar.vcalendar[0].vevent) {
    const [start, startType] = event.dtstart;
    const [end, endType] = event.dtend;
    if (startType.value !== 'DATE' || endType.value !== 'DATE') {
      throw new Error('unknown calendar event type');
    }
    events.push({
      id: event.uid,
      summary: event.summary,
      source: 'gov',
      start: zonedTimeToUtc(start, timeZone),
      end: zonedTimeToUtc(end, timeZone),
    });
  }

  return events;
}
