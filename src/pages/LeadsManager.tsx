import React, { useState, useEffect } from 'react';
import { getLeads, submitContactForm } from '../services/leadsService';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessSegment: string;
  needs: string;
  timestamp: string;
  contactPreference: string[];
}

const LeadsManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      // Ensure data is array
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading leads', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Map simple form to ContactFormData structure
    const data: any = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      businessSegment: formData.get('businessSegment') as string,
      needs: 'Manual Entry',
      contactPreference: [],
      agreeToTerms: true,
    };

    try {
      await submitContactForm(data, false);
      form.reset();
      loadLeads();
    } catch (e) {
      console.error(e);
      alert('Erro ao enviar lead');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow mt-8 text-black">
      <h2 className="text-2xl font-bold mb-4">Gerenciador de Leads</h2>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4" data-testid="leads-form">
        <input name="name" placeholder="Nome" required className="border p-2 rounded" />
        <input name="email" placeholder="Email" required className="border p-2 rounded" />
        <input name="phone" placeholder="Telefone" required className="border p-2 rounded" />
        <input name="businessSegment" placeholder="Segmento" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Enviar Lead</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto" data-testid="leads-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Data</th>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Telefone</th>
              <th className="p-2 text-left">Segmento</th>
              <th className="p-2 text-left">Necessidade</th>
            </tr>
          </thead>
          <tbody id="clientesTbody">
            {leads.map(lead => (
              <tr key={lead.id} className="border-b">
                <td className="p-2 text-sm">{lead.timestamp ? new Date(lead.timestamp).toLocaleDateString() : '-'}</td>
                <td className="p-2 font-medium">{lead.name ? lead.name.substring(0, 3) + '***' : ''}</td>
                <td className="p-2">{lead.email ? lead.email.replace(/(.{2}).+@.+/, '$1***@***') : ''}</td>
                <td className="p-2">{lead.phone ? lead.phone.slice(-4).padStart(lead.phone.length, '*') : ''}</td>
                <td className="p-2">{lead.businessSegment}</td>
                <td className="p-2 text-sm max-w-xs truncate">{lead.needs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsManager;
