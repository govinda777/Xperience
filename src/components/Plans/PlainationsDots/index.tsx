import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationDotsProps {
  total: number;               // Total de bolinhas
  activeIndex: number;         // Índice da bolinha ativa
  onPrev: () => void;          // Função para rolar para a esquerda
  onNext: () => void;          // Função para rolar para a direita
}

const PaginationDots: React.FC<PaginationDotsProps> = ({ total, activeIndex, onPrev, onNext }) => {
  return (
    <div className="pt-5 pb-20 flex flex-col items-center gap-4 md:hidden">
      {/* Bolinhas de Paginação */}
      <div className="flex justify-center items-center gap-2">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              activeIndex === index ? "bg-[#F34A0D] w-14" : "bg-[#E3E3E3]"
            }`}
          />
        ))}
      </div>

      {/* Setas de Navegação */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={onPrev}
          className="bg-[#F34A0D] text-white p-3 rounded-2xl shadow-md"
        >
          <ChevronLeft size={30} />
        </button>

        <button
          onClick={onNext}
          className="bg-[#F34A0D] text-white p-3 rounded-2xl shadow-md"
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default PaginationDots;
