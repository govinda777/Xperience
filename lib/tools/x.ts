import * as z from "zod";
import { createAuditedTool } from "./baseTool";
import { sendDirectMessage } from "../integrations/xClient";

const schema = z.object({
  toHandle: z.string(),
  text: z.string().max(1000),
});

export const sendXDMTool = createAuditedTool({
  name: "send_x_dm",
  description:
    "Sends a direct message on X (Twitter) to a specific @handle.",
  schema,
  handler: async (input) => {
    const res = await sendDirectMessage(input.toHandle, input.text);
    return { dmId: res.id };
  },
});
