import * as z from "zod";
import { createAuditedTool } from "./baseTool.js";
import { calendarClient } from "../integrations/googleCalendarClient.js";

const schema = z.object({
  userId: z.string(), // maps to the user's Google account
  title: z.string(),
  description: z.string().optional(),
  startIso: z.string(), // ISO 8601
  endIso: z.string(),
  attendees: z.array(z.string()).optional(), // emails
});

export const scheduleMeetingTool = createAuditedTool({
  name: "schedule_meeting",
  description:
    "Creates an event on the user's Google Calendar with title, time, and guests.",
  schema,
  handler: async (input) => {
    // The calendarClient uses the Strategy pattern. 
    // It will dynamically use the real integration in production or the mock in development.
    return await calendarClient.scheduleMeeting({
      userId: input.userId,
      title: input.title,
      description: input.description,
      startIso: input.startIso,
      endIso: input.endIso,
      attendees: input.attendees,
    });
  },
});
