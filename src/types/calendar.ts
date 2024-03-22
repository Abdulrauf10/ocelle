export interface CalendarEvent {
  id: string;
  summary: string;
  source: 'gov' | 'database';
  start: Date;
  end: Date;
}
