import { scheduleMeetingTool } from "../../lib/tools/googleCalendar";
import { sendEmailTool } from "../../lib/tools/email";
import { sendXDMTool } from "../../lib/tools/x";
import { sendWhatsAppTool } from "../../lib/tools/whatsapp";
import { sendTelegramTool } from "../../lib/tools/telegram";
import { webSearchTool, xperienceApiTool } from "./tools-mock"; // Keeping existing mocks for now if needed

export const agentTools = [
  scheduleMeetingTool,
  sendEmailTool,
  sendXDMTool,
  sendWhatsAppTool,
  sendTelegramTool,
  webSearchTool, // Keeping web search as it's useful
  xperienceApiTool
];

export type AgentToolName = (typeof agentTools)[number]["name"];
