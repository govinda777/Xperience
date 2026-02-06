import * as z from "zod";
import { createAuditedTool } from "./baseTool";
import { sendTransactionalEmail } from "../integrations/emailClient";

const schema = z.object({
  to: z.string().email(),
  subject: z.string(),
  html: z.string(),
  from: z.string().default("no-reply@xperiencehubs.com"),
});

export const sendEmailTool = createAuditedTool({
  name: "send_email",
  description:
    "Sends a transactional email to the user. Use for confirmations, notifications, and follow-ups.",
  schema,
  handler: async (input) => {
    const result = await sendTransactionalEmail(input);
    return { messageId: result.id };
  },
});
