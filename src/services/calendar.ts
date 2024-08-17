import { fromZonedTime } from 'date-fns-tz';

import redisService from './redis';

import { CalendarEvent } from '@/types';

class CalendarService {
  /**
   * get `https://www.1823.gov.hk/common/ical/en.json` JSON response and parse to calendar events
   */
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const events = await redisService.getCalendarEvents();
    if (events) {
      return events;
    }

    const res = await fetch('https://www.1823.gov.hk/common/ical/en.json');
    if (!res.ok) {
      throw new Error('failed to fetch the iCalendar from 1823 Gov HK');
    }
    const calendar = await res.json();
    const _events: CalendarEvent[] = [];
    const timeZone = calendar.vcalendar[0]['x-wr-timezone'];

    for (const event of calendar.vcalendar[0].vevent) {
      const [start, startType] = event.dtstart;
      const [end, endType] = event.dtend;
      if (startType.value !== 'DATE' || endType.value !== 'DATE') {
        throw new Error('unknown calendar event type');
      }
      _events.push({
        id: event.uid,
        summary: event.summary,
        source: 'gov',
        start: fromZonedTime(start, timeZone),
        end: fromZonedTime(end, timeZone),
      });
    }

    await redisService.setCalendarEvents(_events);

    return _events;
  }
}

const calendarService = new CalendarService();

export default calendarService;
