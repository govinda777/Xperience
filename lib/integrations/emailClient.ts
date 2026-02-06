// Mock implementation for Email Client
// In a real scenario, this would import 'resend' or 'nodemailer'

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendTransactionalEmail(params: EmailParams) {
  console.log("Mock Sending Email:", params);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'sent'
  };
}
