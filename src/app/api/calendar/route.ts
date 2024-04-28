import { getCalendarEvents } from '@/services/calendar';
import { NextResponse } from 'next/server';

export async function GET() {
  const events = await getCalendarEvents();

  return NextResponse.json(events);
}
