import { webSearchTool, xperienceApiTool } from "./tools-mock.js";

// Broken imports removed due to missing files in api/lib/tools/
// import { scheduleMeetingTool } from "../../lib/tools/googleCalendar.js";
// import { sendEmailTool } from "../../lib/tools/email.js";
// import { sendXDMTool } from "../../lib/tools/x.js";
// import { sendWhatsAppTool } from "../../lib/tools/whatsapp.js";
// import { sendTelegramTool } from "../../lib/tools/telegram.js";

export const agentTools = [
  // scheduleMeetingTool,
  // sendEmailTool,
  // sendXDMTool,
  // sendWhatsAppTool,
  // sendTelegramTool,
  webSearchTool,
  xperienceApiTool
];

export type AgentToolName = (typeof agentTools)[number]["name"];
