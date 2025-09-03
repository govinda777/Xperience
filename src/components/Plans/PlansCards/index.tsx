import React from "react";
import Check from "../../../../assets/svg/check.svg";
import { Link, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import Crown from "../../../../assets/svg/crown.svg";

interface PlansCardsProps {
  category:
    | "START"
    | "ESSENCIAL"
    | "PRINCIPAL"
    | "AVANÇADA"
    | "PREMIUM"
    | "NINJA";
  title: string;
  price: number;
  duration: string;
  sessions: {
    total: number;
    details: string;
  };
  periodicity: string;
  modules: string[];
  isRecomendad: boolean;
  link: string;
}

const PlansCards: React.FC<PlansCardsProps> = ({
  category,
  title,
  price,
  duration,
  sessions,
  periodicity,
  modules,
  isRecomendad,
  link,
}) => {
  return (
    <div
      className={`h-full relative md:gap-10 gap-3 justify-center flex flex-col py-8 px-6 rounded-[30px] bg-white max-w-xs md:max-w-xl border-4 ${
        isRecomendad ? "border-[#CC3600]" : "border-[#F2F2F2]"
      }`}
    >
      {/* TAG */}
      {isRecomendad && (
        <div className="py-2 px-6 bg-[#CC3600] rounded-full absolute -top-5 left-1/2 transform -translate-x-1/2">
          <p className="text-white uppercase font-bold text-lg">Recomendado</p>
        </div>
      )}

      {/* Coroa */}
      {isRecomendad && (
        <div className="absolute md:-top-20 md:-right-16 -top-20 -right-10 transform">
          <img
            src={Crown}
            alt="Coroa"
            className="md:w-24 md:h-24 xl:w-24 xl:h-24 w-20 h-20"
          />
        </div>
      )}

      {/* Título */}
      <h1 className="text-xl md:text-2xl font-bold text-[#F34A0D]">{title}</h1>

      {/* Precificação */}
      <div className="mb-4 flex flex-row gap-2 items-end">
        <h1 className="text-4xl md:text-5xl font-bold text-[#060606]">
          R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </h1>
      </div>

      {/* Duração */}
      <div className="flex flex-row gap-2 items-center">
        <img src={Check} alt="Check" className="md:w-5 md:h-5 mt-0.5" />
        <p className="text-[#1A1A1A]">
          <span className="font-bold">Duração:</span> {duration}
        </p>
      </div>

      {/* Sessões */}
      <div className="flex flex-row gap-2 items-center">
        <img src={Check} alt="Check" className="md:w-5 md:h-5 mt-0.5" />
        <p className="text-[#1A1A1A]">
          <span className="font-bold">Sessões:</span> {sessions.total} (
          {sessions.details})
        </p>
      </div>

      {/* Periodicidade */}
      <div className="flex flex-row gap-2 items-center">
        <img src={Check} alt="Check" className="md:w-5 md:h-5 mt-0.5" />
        <p className="text-[#1A1A1A]">
          <span className="font-bold">Periodicidade:</span> {periodicity}
        </p>
      </div>

      {/* Módulos */}
      <div className="mt-4">
        <h3 className="text-[#060606] font-bold mb-2">Módulos Inclusos:</h3>
        <ul className="flex flex-col gap-2">
          {modules.map((module, index) => (
            <div key={index} className="flex flex-row gap-2 items-start">
              <img src={Check} alt="Check" className="md:w-5 md:h-5" />
              <p className="text-[#1A1A1A]">{module}</p>
            </div>
          ))}
        </ul>
      </div>

      <div className="mt-auto mx-auto">
        <PlanButton link={link} isRecomendad={isRecomendad} />
      </div>
    </div>
  );
};

const PlanButton: React.FC<{ link: string; isRecomendad: boolean }> = ({
  link,
  isRecomendad,
}) => {
  const { login } = usePrivy();
  const navigate = useNavigate();

  const handlePlanSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <Link
      to={link}
      onClick={handlePlanSelection}
      className={`py-3 px-6 rounded-full text-white font-bold ${
        isRecomendad ? "bg-[#CC3600]" : "bg-[#F34A0D]"
      }`}
    >
      Começar Agora
    </Link>
  );
};

export default PlansCards;
