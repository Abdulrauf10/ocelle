import { NextResponse } from 'next/server';

import { getCalendarEvents } from '@/services/calendar';

export async function GET() {
  const events = await getCalendarEvents();

  return NextResponse.json(events);
}
