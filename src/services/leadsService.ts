interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  contactPreference: string[];
  businessSegment: string;
  needs: string;
  agreeToTerms: boolean;
}

export const submitContactForm = async (data: ContactFormData, allowPublic: boolean = false) => {
  const promises = [
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'contact', data }),
    })
  ];

  if (allowPublic) {
    promises.push(
      fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.name,
          email: data.email,
          mensagem: data.needs
        }),
      })
    );
  }

  const [response] = await Promise.all(promises);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit contact form');
  }

  return response.json();
};

export const getLeads = async () => {
  const response = await fetch('/api/leads');
  if (!response.ok) throw new Error('Failed to fetch leads');
  return response.json();
};

export const getSubmissions = async () => {
  const response = await fetch('/api/submissions');
  if (!response.ok) throw new Error('Failed to fetch submissions');
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
