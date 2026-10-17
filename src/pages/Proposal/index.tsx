import React, { useRef, useState } from 'react';
import { ProposalTemplate } from '../../components/pdf/ProposalTemplate';
// @ts-ignore - html2pdf doesn't have good type definitions
import html2pdf from 'html2pdf.js';
import { Download, Loader2 } from 'lucide-react';
import PageTitle from '../../components/PageTitle';

export default function ProposalPreview() {
  const proposalRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!proposalRef.current) return;

    try {
      setIsGenerating(true);
      const element = proposalRef.current;
      const opt = {
        margin: 0,
        filename: 'orcamento-xperience.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // @ts-ignore
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <PageTitle
          title="Pré-visualização de Orçamento"
          highlightedWord="Orçamento"
        />
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Gere e exporte propostas comerciais no formato PDF.
        </p>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2 bg-[#F97316] text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-70"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}
          </button>
        </div>

        {/* Scrollable container for the A4 page preview */}
        <div className="overflow-x-auto shadow-2xl rounded-xl bg-white p-4">
          <div className="min-w-fit flex justify-center">
             <ProposalTemplate ref={proposalRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
