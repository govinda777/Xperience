import React, { useState, useEffect } from 'react';
import { getSubmissions, submitContactForm, Submission } from '../services/leadsService';

const LeadsManager: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getSubmissions();
      setSubmissions(data.submissions);
    } catch (error) {
      console.error('Error loading submissions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Adapt to ContactFormData expected by service
    const data = {
      name: formData.get('nome') as string,
      email: (formData.get('email') as string) || 'no-email@example.com',
      phone: (formData.get('telefone') as string) || '0000000000',
      contactPreference: [],
      businessSegment: (formData.get('empresa') as string) || 'Outros',
      needs: 'Adicionado via Manager',
      agreeToTerms: true
    };

    try {
        await submitContactForm(data);
        form.reset();
        loadData();
    } catch (e) {
        console.error(e);
        alert('Erro ao enviar lead');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow mt-8 text-black">
      <h2 className="text-2xl font-bold mb-4">Gerenciador de Submissões (Público)</h2>
      <p className="mb-4 text-sm text-gray-600">Visualização segura de dados anonimizados.</p>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4" data-testid="leads-form">
        <input name="nome" placeholder="Nome" required className="border p-2 rounded" />
        <input name="email" placeholder="Email" className="border p-2 rounded" />
        <input name="telefone" placeholder="Telefone" className="border p-2 rounded" />
        <input name="empresa" placeholder="Empresa" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Enviar Lead</button>
      </form>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto" data-testid="leads-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nome (Anon)</th>
                <th className="p-2 text-left">Email (Anon)</th>
                <th className="p-2 text-left">Mensagem</th>
                <th className="p-2 text-left">Data</th>
              </tr>
            </thead>
            <tbody id="clientesTbody">
              {submissions.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-xs font-mono text-gray-500">{s.id}</td>
                  <td className="p-2 font-medium">{s.nomeAnon}</td>
                  <td className="p-2 text-gray-600">{s.emailAnon}</td>
                  <td className="p-2 text-sm text-gray-500 max-w-xs truncate">{s.mensagem}</td>
                  <td className="p-2 text-sm text-gray-500">{new Date(s.data).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadsManager;
