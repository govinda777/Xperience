import * as z from "zod";
import { createAuditedTool } from "./baseTool";
import { sendWhatsAppMessage } from "../integrations/whatsappClient";

const schema = z.object({
  to: z.string(), // number in international format
  text: z.string().max(1000),
});

export const sendWhatsAppTool = createAuditedTool({
  name: "send_whatsapp_message",
  description:
    "Sends a text message via WhatsApp Cloud API to a specific number.",
  schema,
  handler: async (input) => {
    const res = await sendWhatsAppMessage({
      to: input.to,
      text: input.text,
    });
    return { messageId: res.id };
  },
});
