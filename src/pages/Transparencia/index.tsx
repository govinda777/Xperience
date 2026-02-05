import React, { useEffect, useState } from 'react';
import { getSubmissions, Submission } from '../../services/leadsService';

const Transparencia: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getSubmissions();
      setSubmissions(data.submissions || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error loading submissions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Transparência Xperience</h1>
          <div className="inline-block bg-white px-6 py-2 rounded-full shadow-sm">
            <p className="text-gray-600">
              Total de submissões: <span className="font-bold text-xl text-black">{total}</span>
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Dados anonimizados de clientes reais • Atualização em tempo real
          </p>
        </div>

        {loading && submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Carregando submissões...</div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {submissions.map((s) => (
                    <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{s.nomeAnon}</h3>
                                <p className="text-sm text-gray-500">{s.emailAnon}</p>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                              {new Date(s.data).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed bg-gray-50 p-3 rounded-lg">
                          "{s.mensagem}"
                        </p>
                        <div className="mt-4 flex justify-between items-center text-xs text-gray-400 font-mono">
                            <span>ID: {s.id}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Transparencia;
