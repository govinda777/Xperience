import React, { forwardRef } from 'react';

export interface CapexItem {
  id: string;
  item: string;
  description: string;
  subtotal: number;
}

export interface OpexItem {
  id: string;
  item: string;
  description: string;
  subtotal: number;
}

export interface ClientDetails {
  name: string;
  document: string;
  contactPerson: string;
  email: string;
}

export interface ProviderDetails {
  name: string;
  document: string;
  contactPerson: string;
  email: string;
}

export interface ProposalData {
  proposalNumber: string;
  issueDate: string;
  validUntil: string;
  provider: ProviderDetails;
  client: ClientDetails;
  scopeIntro: string;
  capexItems: CapexItem[];
  capexTotal: number;
  opexItems: OpexItem[];
  opexTotal: number;
  paymentConditions: string;
  taxNotes: string;
}

const mockData: ProposalData = {
  proposalNumber: '#ORC-2026-001',
  issueDate: '17/10/2026',
  validUntil: '31/10/2026',
  provider: {
    name: 'Xperience DAO / Consultoria',
    document: 'CNPJ: 00.000.000/0001-00',
    contactPerson: 'Equipe Comercial',
    email: 'contato@xperience.com',
  },
  client: {
    name: 'Empresa Cliente LTDA',
    document: 'CNPJ: 11.111.111/0001-11',
    contactPerson: 'João Silva',
    email: 'joao@cliente.com',
  },
  scopeIntro:
    'Este documento detalha a proposta de prestação de serviços de consultoria estratégica, focada no mapeamento de negócio e trilhas de capacitação para alavancar os resultados de sua empresa. O escopo a seguir foi desenhado para atender perfeitamente aos objetivos alinhados em nossas reuniões prévias.',
  capexItems: [
    {
      id: '1',
      item: 'Setup / Estruturação',
      description: 'Engloba os 4 pilares: Tecnologia, Acabamentos, Paisagismo e Gestão Financeira/Logística.',
      subtotal: 10000,
    },
  ],
  capexTotal: 10000,
  opexItems: [
    {
      id: '1',
      item: 'Mensalidade Base',
      description: 'Direito a 3 projetos simultâneos.',
      subtotal: 150,
    },
    {
      id: '2',
      item: 'Projetos Adicionais',
      description: 'Valor adicional por projeto ativo (se aplicável).',
      subtotal: 30,
    },
  ],
  opexTotal: 150,
  paymentConditions: '30% no aceite e 70% na entrega final. Opções: PIX, Boleto ou ',
  taxNotes: 'Todos os impostos estão inclusos neste valor.',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export interface ProposalTemplateProps {
  data?: ProposalData;
}

export const ProposalTemplate = forwardRef<HTMLDivElement, ProposalTemplateProps>(
  ({ data = mockData }, ref) => {
    return (
      <div ref={ref} className="bg-white p-10 w-full max-w-[210mm] min-h-[297mm] mx-auto text-[#111827] shadow-lg box-border">
        {/* Adiciona Google Fonts Inter */}
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          .print-avoid-break { page-break-inside: avoid; }
        `}} />

        <div className="font-inter">
          {/* Header */}
          <div className="flex justify-between items-start mb-10 border-b-2 border-gray-100 pb-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-[800] text-[#1E293B] tracking-tight border-b-[3px] border-[#F97316] inline-block pb-1">XPERIENCE</h1>
              <span className="text-[#1E293B] font-semibold text-sm uppercase tracking-widest mt-2">Viva o Extraordinário</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <h2 className="text-[#1E293B] font-bold text-xl uppercase mb-2">Orçamento de Serviços</h2>
              <div className="bg-[#F3F4F6] text-[#111827] px-3 py-1 rounded-full text-xs font-bold mb-1 border border-gray-200">
                {data.proposalNumber}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <p>Emissão: <span className="font-medium text-gray-800">{data.issueDate}</span></p>
                <p>Validade: <span className="font-medium text-gray-800">{data.validUntil}</span></p>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-8 mb-10 print-avoid-break">
            <div className="bg-gray-50 p-5 rounded-[16px] border border-gray-200">
              <h3 className="uppercase font-extrabold text-[#1E293B] text-sm mb-3 border-b-2 border-[#F97316] pb-1 inline-block">
                Dados do Prestador
              </h3>
              <div className="text-sm space-y-1 text-gray-700">
                <p className="font-bold text-[#111827]">{data.provider.name}</p>
                <p>{data.provider.document}</p>
                <p>Ref: {data.provider.contactPerson}</p>
                <p>{data.provider.email}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-5 rounded-[16px] border border-gray-200">
              <h3 className="uppercase font-extrabold text-[#1E293B] text-sm mb-3 border-b-2 border-[#F97316] pb-1 inline-block">
                Dados do Cliente
              </h3>
              <div className="text-sm space-y-1 text-gray-700">
                <p className="font-bold text-[#111827]">{data.client.name}</p>
                <p>{data.client.document}</p>
                <p>Ref: {data.client.contactPerson}</p>
                <p>{data.client.email}</p>
              </div>
            </div>
          </div>

          {/* Scope */}
          <div className="mb-10 print-avoid-break">
            <h3 className="uppercase font-extrabold text-[#1E293B] text-lg mb-3 border-b-2 border-[#F97316] pb-1 inline-block">
              Escopo & Alinhamento Estratégico
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">
              {data.scopeIntro}
            </p>
          </div>

          {/* CAPEX Table */}
          <div className="mb-8 rounded-[12px] overflow-hidden border border-gray-200 print-avoid-break">
             <div className="bg-[#1E293B] px-4 py-2">
                <h4 className="uppercase font-bold text-white text-xs tracking-wider">Investimento Inicial (Setup / CAPEX)</h4>
             </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F9FAFB] text-gray-500 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-200 w-1/3">Item</th>
                  <th className="px-4 py-3 border-b border-gray-200 w-1/2">Descrição</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-right w-1/6">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.capexItems.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]/50'}>
                    <td className="px-4 py-4 font-semibold text-[#111827]">{item.item}</td>
                    <td className="px-4 py-4 text-gray-600">{item.description}</td>
                    <td className="px-4 py-4 text-right font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#F3F4F6] font-bold">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right text-[#1E293B] uppercase text-xs">Total Setup (CAPEX)</td>
                  <td className="px-4 py-3 text-right text-[#166534] text-base">{formatCurrency(data.capexTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* OPEX Table */}
          <div className="mb-10 rounded-[12px] overflow-hidden border border-gray-200 print-avoid-break">
             <div className="bg-[#1E293B] px-4 py-2">
                <h4 className="uppercase font-bold text-white text-xs tracking-wider">Mensalidade Recorrente (OPEX)</h4>
             </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F9FAFB] text-gray-500 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-200 w-1/3">Item</th>
                  <th className="px-4 py-3 border-b border-gray-200 w-1/2">Descrição</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-right w-1/6">Valor (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.opexItems.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]/50'}>
                    <td className="px-4 py-4 font-semibold text-[#111827]">{item.item}</td>
                    <td className="px-4 py-4 text-gray-600">{item.description}</td>
                    <td className="px-4 py-4 text-right font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(item.subtotal)}{item.id === '1' ? '/mês' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary & Payment */}
          <div className="flex justify-end mb-12 print-avoid-break">
            <div className="bg-gray-50 p-6 rounded-[16px] border border-gray-200 w-full max-w-xl">
              <h3 className="uppercase font-extrabold text-[#1E293B] text-sm mb-4 border-b-2 border-[#F97316] pb-1 inline-block">
                Resumo Financeiro & Condições Gerais
              </h3>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-bold text-[#111827] mb-1">Condições de Pagamento:</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{data.paymentConditions}</span>
                    <span className="bg-[#DCFCE7] text-[#166534] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      Web3 / Cripto (USDT / TON)
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-[#111827] mb-1">Tributos & Notas:</p>
                  <p>{data.taxNotes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Signatures */}
          <div className="mt-16 pt-8 border-t-2 border-gray-100 print-avoid-break">
            <h3 className="uppercase font-extrabold text-[#1E293B] text-sm mb-3 border-b-2 border-[#F97316] pb-1 inline-block">
              Termos de Aceite
            </h3>
            <p className="text-xs text-gray-500 mb-16">
              Esta proposta possui validade até {data.validUntil}. As informações aqui contidas são confidenciais.
              O início dos serviços está condicionado ao aceite formal desta proposta e/ou assinatura do contrato correspondente.
            </p>

            <div className="flex justify-between px-8">
              <div className="text-center w-64">
                <div className="border-t border-gray-400 pt-2">
                  <p className="font-bold text-sm text-[#111827]">{data.client.name}</p>
                  <p className="text-xs text-gray-500">Cliente (Aceite)</p>
                </div>
              </div>

              <div className="text-center w-64">
                <div className="border-t border-gray-400 pt-2">
                  <p className="font-bold text-sm text-[#111827]">{data.provider.name}</p>
                  <p className="text-xs text-gray-500">Representante Xperience</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
);

ProposalTemplate.displayName = 'ProposalTemplate';
