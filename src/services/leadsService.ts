interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  contactPreference: string[];
  businessSegment: string;
  needs: string;
  agreeToTerms: boolean;
}

export const submitContactForm = async (data: ContactFormData) => {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'contact', data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit contact form');
  }

  return response.json();
};

export const submitNewsletter = async (email: string) => {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'newsletter', data: { email } }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit newsletter');
  }

  return response.json();
};
