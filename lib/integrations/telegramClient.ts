// Mock implementation for Telegram Client

export async function sendTelegramMessage(chatId: string, text: string) {
    console.log(`Mock: Sending Telegram to ${chatId}: ${text}`);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
        message_id: `msg_${Date.now()}`
    };
}
