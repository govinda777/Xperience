import React from "react";
import Surprised from "../../../assets/svg/surprised.svg";
import Rabisco from "../../../assets/svg/rabisco.svg";
import TypePlans from "../../components/Plans/TypePlans";
import PlansSectionEssential from "../../components/Plans/PlansSectionEssential";
import Idea from "../../../assets/svg/idea.svg";
import Bols1 from "../../../assets/svg/bols1.svg";
import Bols2 from "../../../assets/svg/bols2.svg";
import Warranty from "../../../assets/svg/warranty.svg";
import ContactForm from "../../components/ContactForm";
import PlansSectionExpert from "../../components/Plans/PlansSectionExpert";
import EnjoyTools from "./EnjoyTools";
import Emoji from "../../../assets/svg/emoji.svg";

const Plans: React.FC = () => {
  return (
    <main className="relative bg-gradient-to-r from-[#FADD6B] to-[#FACC15]">
      <img
        src={Bols1}
        alt="bolas 1"
        className="flex absolute left-0 top-2 md:top-8 md:w-auto w-14"
      />
      <img
        src={Bols2}
        alt="bolas 2"
        className="md:block absolute right-0 top-0 md:top-1 md:w-auto w-14 hidden"
      />
      {/* Cabeçalho */}
      <header className="text-center pt-10 md:pt-28 pb-12 relative z-10">
        <h1 className="font-bold text-4xl md:w-auto w-72 mx-auto md:text-5xl">
          Escolha o plano certo e veja seu negócio crescer
        </h1>
        <h2 className="text-lg w-[360px] md:w-auto md:text-xl md:mt-0 mt-12 mx-auto">
          Além da nossa ferramenta <span className="font-bold">gratuita</span>,
          oferecemos consultoria personalizada para levar o seu negócio ao
          próximo nível.
        </h2>
      </header>

      {/* Seção dos planos */}
      <section className=" justify-center items-center flex flex-col py-16 px-4 gap-6 bg-[#FBE151]">
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

      {/* Título com traço Mobile */}
      <div className="pt-2 pb-10 flex flex-col justify-center items-center mx-auto relative md:hidden gap-6">
        <img
          src={Bols2}
          alt="bolas 2"
          className="md:block absolute right-0 -top-16 w-14"
        />

        <img
          src={Emoji}
          alt="emoji"
          className="w-24 flex absolute left-4 top-3"
        />
        <div className="relative mt-32">
          {/* Ícone "Surprised" Posicionado */}
          <img
            src={Surprised}
            alt="Ícone Surpreso"
            className="w-10 md:w-12 absolute -top-4 -left-7 md:-left-8"
          />

          {/* Texto + Rabisco */}
          <h1 className="text-5xl md:text-7xl flex flex-col md:flex-row font-bold relative gap-3 text-center">
            Conheça
          </h1>
        </div>
        <h1 className="flex-col gap-2 flex text-5xl md:text-7xl font-bold text-center">
          nossos planos
          <img
            src={Rabisco}
            alt="Rabisco"
            className="md:w-[100%] w-[85%] mx-auto"
          />
        </h1>
      </div>

      {/* Título com traço Desktop */}
      <div className="pt-24 pb-8 hidden justify-center items-center md:w-1/2 mx-auto md:flex relative">
        <img
          src={Emoji}
          alt="emoji"
          className="md:w-56 md:h-56 flex md:absolute md:top-48 -left-64 md:-left-64"
        />
        <div className="relative">
          {/* Ícone "Surprised" Posicionado */}
          <img
            src={Surprised}
            alt="Ícone Surpreso"
            className="w-10 md:w-12 absolute -top-4 -left-7 md:-left-8"
          />

          {/* Texto + Rabisco */}
          <h1 className="xl:text-6xl md:text-5xl text-5xl flex flex-col sm:flex-row md:flex-row font-bold relative gap-3">
            Conheça
            <div className="flex flex-col gap-1">
              <h1 className="flex-col flex">nossos planos</h1>
              <img src={Rabisco} alt="Rabisco" className="xl:w-[100%] md:w-[85%] w-[85%]" />
            </div>
          </h1>
        </div>
      </div>

      <div className="flex justify-center items-center py-6">
        <div className="inline-block">
          <div className="flex items-center justify-center rounded-full bg-[#F34A0D] py-4 px-10 gap-4">
            <img
              src={Idea}
              alt="Lâmpada Idea"
              className="md:w-12 md:h-12 w-12 h-12"
            />
            <h1 className="font-bold text-2xl md:text-3xl text-white">
              Essencial
            </h1>
          </div>
        </div>
      </div>

      {/* Planos Essencial*/}
      <PlansSectionEssential />

      <div className="flex flex-col justify-center items-center gap-5  text-center">
        <div className="flex justify-center items-center">
          <div className="inline-block">
            <div className="flex items-center justify-center rounded-full bg-[#F34A0D] py-4 px-10 gap-4">
              <img
                src={Warranty}
                alt="Medalha"
                className="md:w-12 md:h-12 w-12 h-12"
              />
              <h1 className="font-bold text-2xl md:text-3xl text-white">
                Expert
              </h1>
            </div>
          </div>
        </div>
        <h1 className="text-[#1a1a1a] text-2xl">
          Pacotes com valores fixo com{" "}
          <span className="uppercase font-bold">serviços especiais.</span>
        </h1>
      </div>

      {/* Planos Expert*/}
      <PlansSectionExpert />

      {/* IA do Empreendedor */}
      <EnjoyTools link="#" />

      {/* Formulário Contato*/}
      <ContactForm isPageContact={false} />
    </main>
  );
};

export default Plans;
