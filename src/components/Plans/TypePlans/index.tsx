import React from "react";
import Idea from "../../../../assets/svg/idea.svg";
import Warranty from "../../../../assets/svg/warranty.svg";
import ArrowDown from "../../../../assets/svg/arrowDown.svg";

interface TypePlansProps {
  type: "MENTORIA" | "ENCUBADORA";
  title: string;
  description: string;
  benefits: string[];
}

const TypePlans: React.FC<TypePlansProps> = ({
  type,
  title,
  description,
  benefits,
}) => {
  return (
    <div className="flex flex-col py-8 px-6 rounded-[49px] bg-white gap-6 max-w-sm">
      {/* Ícone */}
      <img
        src={type === "MENTORIA" ? Idea : Warranty}
        alt={type}
        className="w-12 h-12"
      />

      {/* Título */}
      <h2 className="text-xl md:text-3xl font-bold text-[#1A1A1A]">{title}</h2>

      {/* Descrição */}
      <p className="text-[#1A1A1A] text-sm md:text-base">{description}</p>

      {/* Benefícios */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[#060606] font-bold">Benefícios:</h3>
        <ul className="flex flex-col gap-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2">
              <img src={ArrowDown} alt="Arrow" className="w-5 h-5" />
              <p className="text-[#1A1A1A]">{benefit}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button className="p-3 border border-[#1A1A1A] text-[#1A1A1A] rounded-full md:rounded-[20px] flex items-center justify-center gap-2 hover:bg-gray-100">
          <p className="text-sm font-bold">Saiba mais</p>
          <img src={ArrowDown} alt="Flecha para baixo" className="md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};

export default TypePlans;
