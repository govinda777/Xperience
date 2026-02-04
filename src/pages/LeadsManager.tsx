import React, { useState, useEffect } from 'react';

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  empresa: string;
  status: string;
}

const LeadsManager: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClientes = async () => {
    try {
      const res = await fetch('/api/clientes');
      if (res.ok) {
        const data = await res.json();
        setClientes(data);
      } else {
        console.error('Failed to fetch clients');
      }
    } catch (error) {
      console.error('Error loading clients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Reset form
    form.reset();
    loadClientes();
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow mt-8 text-black">
      <h2 className="text-2xl font-bold mb-4">Gerenciador de Leads</h2>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4" data-testid="leads-form">
        <input name="nome" placeholder="Nome" required className="border p-2 rounded" />
        <input name="telefone" placeholder="Telefone" required className="border p-2 rounded" />
        <input name="empresa" placeholder="Empresa" required className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Enviar Lead</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto" data-testid="leads-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Telefone</th>
              <th className="p-2 text-left">Empresa</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody id="clientesTbody">
            {clientes.map(c => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.nome?.substring(0,1)}*****</td>
                <td className="p-2">{c.telefone?.slice(-4) || ''}</td>
                <td className="p-2">{c.empresa}</td>
                <td className="p-2">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsManager;
