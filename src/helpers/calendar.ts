import Redis from 'ioredis';
import { CalendarEvent } from '@/types';
import { zonedTimeToUtc } from 'date-fns-tz';

interface I1823ICalendar {
  vcalendar: Array<{
    prodid: string;
    version: string;
    calscale: string;
    'x-wr-calname': string;
    'x-wr-caldesc': string;
    'x-wr-timezone': string;
    vevent: Array<{
      uid: string;
      transp: string;
      summary: string;
      dtstart: [string, { value: string }];
      dtend: [string, { value: string }];
    }>;
  }>;
}

/**
 * get `https://www.1823.gov.hk/common/ical/en.json` JSON response and parse to calendar events
 */
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const redis = new Redis();
  const cachedCalendar = await redis.get('storefront-1823-icalendar');
  const events: CalendarEvent[] = [];
  let calendar: I1823ICalendar;

  if (cachedCalendar) {
    calendar = JSON.parse(cachedCalendar);
  } else {
    const res = await fetch('https://www.1823.gov.hk/common/ical/en.json');

    if (!res.ok) {
      throw new Error('failed to fetch the iCalendar from 1823 Gov HK');
    }

    calendar = await res.json();

    // cache alive 30 days
    await redis.set('storefront-1823-icalendar', JSON.stringify(calendar), 'EX', 60 * 60 * 24 * 30);
  }

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
