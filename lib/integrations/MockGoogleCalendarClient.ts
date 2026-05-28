import { IGoogleCalendarClient, ScheduleMeetingInput, ScheduleMeetingOutput } from './IGoogleCalendarClient.js';

export class MockGoogleCalendarClient implements IGoogleCalendarClient {
  async scheduleMeeting(input: ScheduleMeetingInput): Promise<ScheduleMeetingOutput> {
    console.log(`[MockGoogleCalendar] Fetching Google Auth for user ${input.userId}`);
    console.log("[MockGoogleCalendar] Scheduled meeting", input);

    return {
      eventId: `evt_${Date.now()}`,
      htmlLink: `https://calendar.google.com/event?id=mock`,
    };
  }
}
