import React, { useState } from "react";
import PlansCards from "./PlansCards";

const plans = [
  {
    title: "Explorador",
    isFree: true,
    isRecomendad: false,
    price: 0.0,
    topics: ["Mapa do negócio", "Relatório Xperience", "Relatório SEO", "Mapa de maturidade"],
    link: "#",
  },
  {
    title: "Inovador",
    isFree: false,
    isRecomendad: false,
    price: 100.0,
    topics: ["Sessão de análise do negócio 2h por mês", "Aprimoramento dos relatórios por especialistas"],
    link: "#",
  },
  {
    title: "Notável",
    isFree: false,
    isRecomendad: true,
    price: 200.0,
    topics: ["Sessão de análise do negócio - 1h por semana", "Guia de planejamento e execução das ações"],
    link: "#",
  },
];

const PlansSection = () => {
  const [activePlan, setActivePlan] = useState("Mensal");
  const percentage = 20;

  return (
    <section className="flex flex-col justify-center items-center w-full">
      {/* Botões de Seleção */}
      <div className="bg-[#F2F2F2] p-2 rounded-full flex flex-row gap-2">
        <button
          onClick={() => setActivePlan("Mensal")}
          className={`${
            activePlan === "Mensal" ? "bg-[#060606] text-white" : "text-[#060606]"
          } font-bold py-3 px-12 rounded-full text-lg md:text-xl`}
        >
          <p>Mensal</p>
        </button>
        <button
          onClick={() => setActivePlan("Anual")}
          className={`${
            activePlan === "Anual" ? "bg-[#060606] text-white" : "text-[#060606]"
          } font-bold py-3 px-8 rounded-full text-lg md:text-xl`}
        >
          <p>
            Anual{" "}
            <span
              className={`${
                activePlan === "Anual" ? "text-white" : "text-[#D00F0F]"
              } font-normal text-sm md:text-base`}
            >
              -{percentage}% off
            </span>
          </p>
        </button>
      </div>

      {/* Planos */}
      <div className="flex overflow-x-auto gap-6 py-24 md:px-28 px-8  scrollbar-hide md:w-auto w-full">
        {plans.map((plan, index) => (
          <div key={index} className="shrink-0 min-w-[280px] md:min-w-[320px]">
            <PlansCards
              {...plan}
              time={activePlan === "Mensal" ? "mês" : "ano"}
              price={
                activePlan === "Mensal"
                  ? plan.price
                  : plan.price 
              }
              percentage={activePlan === "Anual" ? percentage : 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlansSection;
