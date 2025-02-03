import React from "react";
import Idea from "../../../assets/svg/idea.svg";
import Warranty from "../../../assets/svg/warranty.svg";
import ArrowDown from "../../../assets/svg/arrowDown.svg";

interface TypePlansProps {
  title: string;
  iconName: "Idea" | "Warranty";
  paragraphStart: string;
  paragraphBold: string;
  paragraphEnd: string;
}

const iconMap = {
  Idea,
  Warranty,
};

const TypePlans: React.FC<TypePlansProps> = ({
  title,
  iconName,
  paragraphStart,
  paragraphBold,
  paragraphEnd,
}) => {
  return (
    <div className="flex flex-col py-4 px-6 rounded-[49px] bg-white gap-3 max-w-sm">
      {/* Ícone */}
      <img src={iconMap[iconName]} alt={iconName} className="w-12 h-12" />

      {/* Título */}
      <h2 className="text-xl md:text-3xl font-bold text-[#1A1A1A]">{title}</h2>

      {/* Parágrafo com os trechos em negrito corretamente */}
      <p className="text-[#1A1A1A] text-sm md:text-base w-60">
        {paragraphStart} <span className="font-bold">{paragraphBold}</span>{" "}
        <span className="">{paragraphEnd}</span>.
      </p>
      <div>
        <button className="p-3 border border-[#1A1A1A] text-[#1A1A1A] rounded-full md:rounded-[20px] flex items-center justify-center gap-2 hover:bg-gray-100">
          <p className="text-sm font-bold">Saiba mais</p>
          <img
            src={ArrowDown}
            alt="Flecha para baixo"
            className="md:w-5 md:h-5"
          />
        </button>
      </div>
    </div>
  );
};

export default TypePlans;
