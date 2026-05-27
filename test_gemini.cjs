const { ChatOpenAI } = require("@langchain/openai");
const fs = require("fs");

let geminiApiKey;
try {
  const env = fs.readFileSync(".env", "utf8");
  const match = env.match(/GEMINI_API_KEY=(.*)/);
  geminiApiKey = match ? match[1].trim() : undefined;
} catch (e) {
  console.error("Failed to read .env file", e);
}

console.log("Using API Key:", geminiApiKey ? geminiApiKey.substring(0, 10) + "..." : "undefined");

async function run() {
  const llm = new ChatOpenAI({
    apiKey: geminiApiKey,
    openAIApiKey: geminiApiKey,
    configuration: {
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    },
    model: "gemini-2.5-flash",
    temperature: 0.2,
  });

  try {
    console.log("Testing SystemMessage + HumanMessage...");
    const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
    const response = await llm.invoke([
      new SystemMessage("Você é um analista estratégico."),
      new HumanMessage("Diga 'olá' em uma palavra.")
    ]);
    console.log("Success:", response.content);
  } catch (err) {
    console.error("Failed:", err.message || err);
  }
}

run();
