// Mock implementation for WhatsApp Client

interface WhatsAppMessage {
    to: string;
    text: string;
}

export async function sendWhatsAppMessage(params: WhatsAppMessage) {
    console.log(`Mock: Sending WhatsApp to ${params.to}: ${params.text}`);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
        id: `wam_${Date.now()}`
    };
}
