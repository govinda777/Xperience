import React, { forwardRef } from 'react';

export interface BudgetItem {
  id: string;
  item: string;
  description: string;
  quantity: string;
  unitPrice: number;
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
  items: BudgetItem[];
  totalInvestment: number;
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
  items: [
    {
      id: '1',
      item: 'Mapeamento de Negócio',
      description: 'Análise detalhada do cenário atual, levantamento de requisitos e definição de OKRs.',
      quantity: '1 Módulo',
      unitPrice: 5000,
      subtotal: 5000,
    },
    {
      id: '2',
      item: 'Trilhas de Capacitação',
      description: 'Acesso a plataforma com conteúdos sobre gestão e inovação.',
      quantity: '3 Meses',
      unitPrice: 1500,
      subtotal: 4500,
    },
    {
      id: '3',
      item: 'Consultoria Estratégica',
      description: 'Sessões de mentoria quinzenais.',
      quantity: '6 Horas',
      unitPrice: 800,
      subtotal: 4800,
    },
  ],
  totalInvestment: 14300,
  paymentConditions: '30% no aceite e 70% na entrega final. Opções: PIX, Boleto ou Cripto (USDT/USDC via Web3).',
  taxNotes: 'Modalidade OPEX. Todos os impostos estão inclusos neste valor.',
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
        `}} />

        <div className="font-inter">
          {/* Header */}
          <div className="flex justify-between items-start mb-10 border-b-2 border-gray-100 pb-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight">XPERIENCE</h1>
              <span className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mt-1">Viva o Extraordinário</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <h2 className="text-[#1E293B] font-bold text-xl uppercase mb-2">Orçamento de Serviços</h2>
              <div className="bg-[#DCFCE7] text-[#166534] px-3 py-1 rounded-full text-xs font-bold mb-1">
                {data.proposalNumber}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <p>Emissão: <span className="font-medium text-gray-800">{data.issueDate}</span></p>
                <p>Validade: <span className="font-medium text-gray-800">{data.validUntil}</span></p>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
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
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
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
          <div className="mb-10">
            <h3 className="uppercase font-extrabold text-[#1E293B] text-lg mb-3 border-b-2 border-[#F97316] pb-1 inline-block">
              Escopo & Alinhamento Estratégico
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">
              {data.scopeIntro}
            </p>
          </div>

          {/* Services Table */}
          <div className="mb-10 rounded-xl overflow-hidden border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F9FAFB] text-gray-500 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-200">Item</th>
                  <th className="px-4 py-3 border-b border-gray-200">Descrição / Módulos</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-center">Qtd</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-right">Valor Unit.</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]/50'}>
                    <td className="px-4 py-4 font-semibold text-[#111827]">{item.item}</td>
                    <td className="px-4 py-4 text-gray-600">{item.description}</td>
                    <td className="px-4 py-4 text-center text-gray-700 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-4 py-4 text-right text-gray-700 whitespace-nowrap">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-4 text-right font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex justify-end mb-12">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 w-full max-w-md">
              <h3 className="uppercase font-extrabold text-[#1E293B] text-sm mb-4 border-b-2 border-[#F97316] pb-1 inline-block">
                Resumo Financeiro
              </h3>

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">Investimento Total</span>
                <span className="text-2xl font-extrabold text-[#166534]">
                  {formatCurrency(data.totalInvestment)}
                </span>
              </div>

              <div className="space-y-3 text-xs text-gray-600">
                <p>
                  <strong className="text-gray-800">Condições de Pagamento:</strong><br/>
                  {data.paymentConditions}
                </p>
                <p>
                  <strong className="text-gray-800">Tributos & Modalidade:</strong><br/>
                  {data.taxNotes}
                </p>
              </div>
            </div>
          </div>

          {/* Terms & Signatures */}
          <div className="mt-16 pt-8 border-t-2 border-gray-100">
            <h3 className="uppercase font-extrabold text-[#1E293B] text-sm mb-3 border-b-2 border-[#F97316] pb-1 inline-block">
              Termos de Aceite
            </h3>
            <p className="text-xs text-gray-500 mb-12">
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
