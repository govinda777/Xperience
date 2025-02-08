import React from "react";
import Surprised from "../../../assets/svg/surprised.svg";
import Rabisco from "../../../assets/svg/rabisco.svg";
import TypePlans from "../../components/plans/TypePlans";
import PlansSection from "../../components/plans/PlansSection";

const Plans: React.FC = () => {
  return (
    <main className="relative bg-gradient-to-r from-[#FADD6B] to-[#FACC15]">
      {/* Cabeçalho */}
      <header className="text-center pt-28 pb-12 relative z-10">
        <h1 className="font-bold text-5xl">
          Escolha o plano certo e veja seu negócio crescer
        </h1>
        <h2 className="text-lg w-[360px] md:w-auto md:text-xl md:mt-0 mt-12 mx-auto">
          Além da nossa ferramenta <span className="font-bold">gratuita</span>,
          oferecemos consultoria personalizada para levar o seu negócio ao
          próximo nível.
        </h2>
      </header>

      {/* Seção dos planos */}
      <section className="relative justify-center items-center flex flex-col py-16 px-4 gap-6 bg-[#FBE151] z-10">
        <h1 className="font-bold text-[#F34A0D] text-center text-4xl">
          São dois tipos de planos
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <TypePlans
            title="Essencial"
            paragraphStart="Você poderá contratar um plano para obter"
            paragraphBold="renovação mensal"
            paragraphEnd="de seus benefícios"
            iconName="Warranty"
          />
          <TypePlans
            title="Expert"
            paragraphStart="Eleve sua empresa para outro nível com"
            paragraphBold="pacotes de serviços"
            paragraphEnd="e mentorias especializadas"
            iconName="Idea"
          />
        </div>
      </section>

      {/* Título com traço */}
      <div className="py-10 flex justify-center items-center w-1/2 mx-auto relative">
        <div className="relative">
          {/* Ícone "Surprised" Posicionado */}
          <img
            src={Surprised}
            alt="Ícone Surpreso"
            className="w-10 md:w-12 absolute -top-4 -left-7 md:-left-8"
          />

          {/* Texto + Rabisco */}
          <h1 className="text-5xl flex flex-col md:flex-row font-bold relative gap-3">
            Conheça
            <h1 className="flex-col gap-2 flex">
              nossos planos
              <img src={Rabisco} alt="Rabisco" className="md:w-[80%] w-[60%]" />
            </h1>
          </h1>
        </div>
      </div>

      {/* Planos */}
      <PlansSection/>
    </main>
  );
};

export default Plans;
