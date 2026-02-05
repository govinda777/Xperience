interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  contactPreference: string[];
  businessSegment: string;
  needs: string;
  agreeToTerms: boolean;
}

export interface Submission {
  id: string;
  nomeAnon: string;
  emailAnon: string;
  mensagem: string;
  data: string;
}

export interface SubmissionsResponse {
  submissions: Submission[];
  total: number;
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

export const getSubmissions = async (): Promise<SubmissionsResponse> => {
  const response = await fetch('/api/submissions');
  if (!response.ok) {
     throw new Error('Failed to fetch submissions');
  }
  return response.json();
};
