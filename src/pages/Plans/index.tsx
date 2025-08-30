import React, { useState } from "react";
import Surprised from "../../../assets/svg/surprised.svg";
import Rabisco from "../../../assets/svg/rabisco.svg";
import TypePlans from "../../components/Plans/TypePlans";
import Idea from "../../../assets/svg/idea.svg";
import Bols1 from "../../../assets/svg/bols1.svg";
import Bols2 from "../../../assets/svg/bols2.svg";
import Warranty from "../../../assets/svg/warranty.svg";
import ContactForm from "../../components/ContactForm";
import EnjoyTools from "./EnjoyTools";
import Emoji from "../../../assets/svg/emoji.svg";
import PlansTable from "../../components/Plans/PlansTable";

const Plans: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MENTORIA' | 'ENCUBADORA'>('MENTORIA');

  const mentoringPlans = [
    {
      category: "START" as const,
      title: "Start",
      price: 1500,
      participationPercentage: 0,
      duration: "3 meses",
      sessions: {
        total: 4,
        details: "1 sessão x 2h, 3 sessões x 1h",
      },
      periodicity: "1 sessão/mês",
      modules: ["Módulo 1", "Módulo 2"],
      isRecomendad: false,
      link: "/plans/start",
    },
    {
      category: "ESSENCIAL" as const,
      title: "Essencial",
      price: 3000,
      participationPercentage: 0,
      duration: "3 meses",
      sessions: {
        total: 6,
        details: "1 sessão x 2h, 5 sessões x 1h",
      },
      periodicity: "1 sessão/15 dias",
      modules: ["Módulo 1", "Módulo 2", "Módulo 3"],
      isRecomendad: false,
      link: "/plans/essencial",
    },
    {
      category: "PRINCIPAL" as const,
      title: "Principal",
      price: 6000,
      participationPercentage: 0,
      duration: "3 meses",
      sessions: {
        total: 9,
        details: "1 sessão x 3h, 8 sessões x 1,5h",
      },
      periodicity: "1 sessão/semana",
      modules: ["Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4", "Módulo 5"],
      isRecomendad: true,
      link: "/plans/principal",
    },
    {
      category: "AVANÇADA" as const,
      title: "Avançada",
      price: 10000,
      participationPercentage: 0,
      duration: "6 meses",
      sessions: {
        total: 25,
        details: "1 sessão x 3h, 24 sessões x 1,5h",
      },
      periodicity: "1 sessão/15 dias",
      modules: ["Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4", "Módulo 5"],
      isRecomendad: false,
      link: "/plans/avancada",
    },
    {
      category: "PREMIUM" as const,
      title: "Premium",
      price: 30000,
      participationPercentage: 0,
      duration: "12 meses",
      sessions: {
        total: 0,
        details: "a combinar",
      },
      periodicity: "a combinar",
      modules: ["Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4", "Módulo 5", "Módulo 6"],
      isRecomendad: false,
      link: "/plans/premium",
    },
  ];

  const incubatorPlans = [
    {
      category: "START" as const,
      title: "Start",
      price: 500,
      participationPercentage: 5,
      duration: "3 meses",
      sessions: {
        total: 4,
        details: "1 sessão x 2h, 3 sessões x 1h",
      },
      periodicity: "1 sessão/mês",
      modules: ["Build: Site", "Build: Social Media"],
      isRecomendad: false,
      link: "/plans/incubator/start",
    },
    {
      category: "ESSENCIAL" as const,
      title: "Essencial",
      price: 1000,
      participationPercentage: 7,
      duration: "3 meses",
      sessions: {
        total: 6,
        details: "1 sessão x 2h, 5 sessões x 1h",
      },
      periodicity: "1 sessão/15 dias",
      modules: ["Build: Site", "Build: Social Media", "Build: Process Map"],
      isRecomendad: false,
      link: "/plans/incubator/essencial",
    },
    {
      category: "PRINCIPAL" as const,
      title: "Principal",
      price: 2000,
      participationPercentage: 10,
      duration: "3 meses",
      sessions: {
        total: 9,
        details: "1 sessão x 3h, 8 sessões x 1,5h",
      },
      periodicity: "1 sessão/semana",
      modules: [
        "Build: Site",
        "Build: Social Media",
        "Build: Process Map",
        "Build: Member channel",
        "Build: YouTube channel",
      ],
      isRecomendad: true,
      link: "/plans/incubator/principal",
    },
    {
      category: "AVANÇADA" as const,
      title: "Avançada",
      price: 4000,
      participationPercentage: 15,
      duration: "6 meses",
      sessions: {
        total: 25,
        details: "1 sessão x 3h, 24 sessões x 1,5h",
      },
      periodicity: "1 sessão/15 dias",
      modules: [
        "Build: Site",
        "Build: Social Media",
        "Build: Process Map",
        "Build: Member channel",
        "Build: YouTube channel",
      ],
      isRecomendad: false,
      link: "/plans/incubator/avancada",
    },
    {
      category: "PREMIUM" as const,
      title: "Premium",
      price: 8000,
      participationPercentage: 20,
      duration: "12 meses",
      sessions: {
        total: 0,
        details: "a combinar",
      },
      periodicity: "a combinar",
      modules: [
        "Build: Site",
        "Build: Social Media",
        "Build: Process Map",
        "Build: Member channel",
        "Build: YouTube channel",
        "Build: Token / NFT",
      ],
      isRecomendad: false,
      link: "/plans/incubator/premium",
    },
  ];

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

      {/* Seção dos tipos de planos */}
      <section className="justify-center items-center flex flex-col py-16 px-4 gap-6 bg-[#FBE151]">
        <h1 className="font-bold text-[#F34A0D] text-center text-4xl">
          Escolha o programa ideal para você
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <TypePlans
            type="MENTORIA"
            title="Mentoria Individual"
            description="Consultoria personalizada com nossos especialistas"
            benefits={[
              "Mentoria individual",
              "Acompanhamento personalizado",
              "Suporte dedicado"
            ]}
          />
          <TypePlans
            type="ENCUBADORA"
            title="Encubadora"
            description="Processo completo de incubação de experiências"
            benefits={[
              "Desenvolvimento completo",
              "Pacotes de serviços",
              "Suporte premium"
            ]}
          />
        </div>
      </section>

      {/* Tabs de navegação */}
      <div className="flex justify-center gap-4 py-8">
        <button
          onClick={() => setActiveTab('MENTORIA')}
          className={`px-6 py-3 rounded-lg font-semibold ${
            activeTab === 'MENTORIA'
              ? 'bg-[#F34A0D] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Mentoria Individual
        </button>
        <button
          onClick={() => setActiveTab('ENCUBADORA')}
          className={`px-6 py-3 rounded-lg font-semibold ${
            activeTab === 'ENCUBADORA'
              ? 'bg-[#F34A0D] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Encubadora
        </button>
      </div>

      {/* Seção dos planos */}
      <section className="py-16 px-4">
        {activeTab === 'MENTORIA' ? (
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">
              Programa Xperience - Mentoria Individual
            </h2>
            <PlansTable
              type="MENTORIA"
              plans={mentoringPlans}
            />
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">
              Programa Xperience - Encubadora
            </h2>
            <PlansTable
              type="ENCUBADORA"
              plans={incubatorPlans}
            />
          </div>
        )}
      </section>

      {/* Seção de ferramentas */}
      <EnjoyTools link="#" />

      {/* Seção de garantia */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <img src={Warranty} alt="Garantia" className="mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-4">Garantia de Satisfação</h2>
          <p className="text-lg text-gray-600">
            Se você não ficar satisfeito com nossos serviços nos primeiros 7 dias,
            devolvemos seu dinheiro.
          </p>
        </div>
      </section>

      {/* Formulário de contato */}
      <ContactForm isPageContact={false} />
    </main>
  );
};

export default Plans;
