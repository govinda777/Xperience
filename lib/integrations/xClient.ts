// Mock implementation for X (Twitter) Client

export async function sendDirectMessage(toHandle: string, text: string) {
    console.log(`Mock: Sending X DM to ${toHandle}: ${text}`);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
        id: `dm_${Date.now()}`
    };
}
