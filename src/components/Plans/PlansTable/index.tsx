import React from 'react';

interface Plan {
  category: string;
  title: string;
  price: number | string;
  duration: string;
  sessions: {
    total: number | string;
    details: string;
  };
  periodicity: string;
  modules: (string | null)[];
  isRecomendad: boolean;
  link: string;
}

interface PlansTableProps {
  type: 'MENTORIA' | 'ENCUBADORA';
  plans: Plan[];
}

const moduleNames = [
  'MÓDULO 1',
  'MÓDULO 2',
  'MÓDULO 3',
  'MÓDULO 4',
  'MÓDULO 5',
  'MÓDULO 6',
];

const cellBorder = 'border border-[#F2F2F2]';

const PlansTable: React.FC<PlansTableProps> = ({ type, plans }) => {
  const hasNinja = type === 'MENTORIA';
  const columns = [...plans.map(plan => plan.title), ...(hasNinja ? ['NINJA'] : [])];

  const getModuleCell = (plan: Plan, moduleIndex: number) => {
    if (plan.modules.length > moduleIndex && plan.modules[moduleIndex]) return 'X';
    return '-';
  };

  const ninjaCells = {
    INVESTIMENTO: 'Fechado para novos inscritos',
    DURAÇÃO: '-',
    SESSÕES: '-',
    PERIODICIDADE: '-',
    MODULES: ['-', '-', '-', '-', '-', '-'],
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="w-full overflow-x-auto py-10 flex justify-center" style={{ fontFamily: 'Quicksand, Poppins, Inter, sans-serif' }}>
      <div className="rounded-2xl shadow-2xl bg-white w-full max-w-[1200px] border border-[#F2F2F2]">
        <table className="min-w-[900px] w-full border-separate" style={{ borderSpacing: 0 }}>
          <thead>
            <tr>
              <th className={`sticky left-0 z-20 py-6 px-4 text-xl font-extrabold text-black bg-[#FFF1E7] rounded-tl-2xl align-middle shadow-md ${cellBorder}`}>CATEGORIA</th>
              {plans.map((plan, idx) => (
                <th
                  key={plan.title}
                  className={`py-6 px-4 text-xl font-extrabold align-middle bg-white text-center ${cellBorder} ${idx === plans.length-1 && !hasNinja ? 'rounded-tr-2xl' : ''}`}
                  style={{ color: '#F34A0D', fontWeight: 800 }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <span>{plan.title}</span>
                    {plan.isRecomendad && (
                      <span className="mt-2 px-3 py-1 bg-[#F34A0D] text-white text-xs font-bold rounded-full shadow" style={{ letterSpacing: 1 }}>RECOMENDADO</span>
                    )}
                  </div>
                </th>
              ))}
              {hasNinja && (
                <th className={`py-6 px-4 text-xl font-extrabold align-middle bg-white text-center rounded-tr-2xl ${cellBorder}`} style={{ color: '#F34A0D', fontWeight: 800 }}>NINJA</th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Investimento */}
            <tr style={{ background: '#FFFDF8' }}>
              <td className={`sticky left-0 z-10 py-6 px-4 font-bold text-black bg-[#FFF1E7] align-middle shadow-md ${cellBorder}`}>INVESTIMENTO</td>
              {plans.map((plan) => (
                <td key={plan.title} className={`py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`}>{formatPrice(plan.price)}</td>
              ))}
              {hasNinja && <td className={`py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`}>{ninjaCells.INVESTIMENTO}</td>}
            </tr>
            {/* Duração */}
            <tr style={{ background: '#F9F6F1' }}>
              <td className={`sticky left-0 z-10 py-6 px-4 font-bold text-black bg-[#FFF1E7] align-middle shadow-md ${cellBorder}`}>DURAÇÃO</td>
              {plans.map((plan) => (
                <td key={plan.title} className={`py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`}>{plan.duration}</td>
              ))}
              {hasNinja && <td className={`py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`}>{ninjaCells.DURAÇÃO}</td>}
            </tr>
            {/* Sessões */}
            <tr style={{ background: '#FFFDF8' }}>
              <td className={`sticky left-0 z-10 py-6 px-4 font-bold text-black bg-[#FFF1E7] align-middle shadow-md ${cellBorder}`}>SESSÕES</td>
              {plans.map((plan) => (
                <td key={plan.title} className={`py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`}>
                  <div className="whitespace-pre-line">
                    {plan.sessions.total} SESSÕES:
                    <br />
                    {plan.sessions.details}
                  </div>
                </td>
              ))}
              {hasNinja && <td className={`py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`}>{ninjaCells.SESSÕES}</td>}
            </tr>
            {/* Periodicidade */}
            <tr style={{ background: '#F9F6F1' }}>
              <td className={`sticky left-0 z-10 py-6 px-4 font-bold text-black bg-[#FFF1E7] align-middle shadow-md ${cellBorder}`}>PERIODICIDADE</td>
              {plans.map((plan) => (
                <td key={plan.title} className={`py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`}>{plan.periodicity}</td>
              ))}
              {hasNinja && <td className={`py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`}>{ninjaCells.PERIODICIDADE}</td>}
            </tr>
            {/* Modules */}
            {moduleNames.map((mod, i) => (
              <tr key={mod} style={{ background: i % 2 === 0 ? '#FFFDF8' : '#F9F6F1' }}>
                <td className={`sticky left-0 z-10 py-6 px-4 font-bold text-black bg-[#FFF1E7] align-middle shadow-md ${cellBorder}`}>**{mod} ***</td>
                {plans.map((plan) => (
                  <td key={plan.title} className={`py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`}>
                    {getModuleCell(plan, i)}
                  </td>
                ))}
                {hasNinja && <td className={`py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`}>-</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlansTable; 