import * as z from "zod";
// import { google } from "googleapis"; // Uncomment when real integration is ready
import { createAuditedTool } from "./baseTool";
import { getGoogleAuthForUser } from "../integrations/googleCalendarClient";

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
    // In production:
    // const auth = await getGoogleAuthForUser(input.userId);
    // const calendar = google.calendar({ version: "v3", auth });
    // ... insert event ...

    // Mock implementation
    await getGoogleAuthForUser(input.userId);
    console.log("Mock: Scheduled meeting", input);

    return {
      eventId: `evt_${Date.now()}`,
      htmlLink: `https://calendar.google.com/event?id=mock`,
    };
  },
});
