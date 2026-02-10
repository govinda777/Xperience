import { scheduleMeetingTool } from "../../lib/tools/googleCalendar.js";
import { sendEmailTool } from "../../lib/tools/email.js";
import { sendXDMTool } from "../../lib/tools/x.js";
import { sendWhatsAppTool } from "../../lib/tools/whatsapp.js";
import { sendTelegramTool } from "../../lib/tools/telegram.js";
import { webSearchTool, xperienceApiTool } from "./tools-mock.js";

export const agentTools = [
  scheduleMeetingTool,
  sendEmailTool,
  sendXDMTool,
  sendWhatsAppTool,
  sendTelegramTool,
  webSearchTool,
  xperienceApiTool
];

export type AgentToolName = (typeof agentTools)[number]["name"];
