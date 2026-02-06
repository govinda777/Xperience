import * as z from "zod";
import { createAuditedTool } from "./baseTool";
import { sendTelegramMessage } from "../integrations/telegramClient";

const schema = z.object({
  chatId: z.string(),
  text: z.string().max(4096),
});

export const sendTelegramTool = createAuditedTool({
  name: "send_telegram_message",
  description:
    "Sends a message via Telegram Bot API to a specific chat.",
  schema,
  handler: async (input) => {
    const res = await sendTelegramMessage(input.chatId, input.text);
    return { messageId: res.message_id };
  },
});
