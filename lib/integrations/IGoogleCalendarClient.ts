export interface ScheduleMeetingInput {
  userId: string;
  title: string;
  description?: string;
  startIso: string;
  endIso: string;
  attendees?: string[];
}

export interface ScheduleMeetingOutput {
  eventId: string;
  htmlLink: string;
}

export interface IGoogleCalendarClient {
  scheduleMeeting(input: ScheduleMeetingInput): Promise<ScheduleMeetingOutput>;
}
