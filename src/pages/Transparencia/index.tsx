import React, { useEffect, useState } from 'react';
import { getSubmissions } from '../../services/leadsService';
import { Link } from 'react-router-dom';

interface Submission {
  id: string;
  nomeAnon: string;
  emailAnon: string;
  mensagem: string;
  data: string;
}

const Transparencia: React.FC = () => {
  const [data, setData] = useState<{ submissions: Submission[]; total: number }>({ submissions: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const json = await getSubmissions();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Refresh 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-20 text-black">Carregando submissões...</div>;

  return (
    <section className="transparencia py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-black">Transparência Xperience</h1>
        <div className="mb-8 text-center">
          <p className="text-2xl text-gray-800">Total submissões: <strong>{data.total}</strong></p>
          <p className="text-lg text-gray-600 mt-2">Dados anonimizados de clientes reais</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.submissions.map((s) => (
            <div key={s.id} className="card bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-3">
                <span className="font-semibold text-blue-600">{s.nomeAnon}</span>
                <span className="ml-2 text-sm text-gray-500">({s.emailAnon})</span>
              </div>
              <p className="text-gray-800 mb-3 italic">"{s.mensagem}"</p>
              <span className="text-xs text-gray-400">
                {new Date(s.data).toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
        {data.submissions.length === 0 && !loading && (
          <div className="text-center text-gray-500">
            Nenhuma submissão pública ainda. Seja o primeiro!
          </div>
        )}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">Auto-atualiza a cada 10s • Apenas últimos 100</p>
          <Link to="/contact" className="inline-block mt-4 text-blue-600 hover:underline">
            Quero participar
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Transparencia;
