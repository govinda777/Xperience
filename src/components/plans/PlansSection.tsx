import React, { useState } from "react";
import PlansCards from "./PlansCards"; 

const PlansSection = () => {
  const [activePlan, setActivePlan] = useState("Mensal"); 

  return (
    <section className="flex flex-col justify-center items-center">
      {/* Botões de Seleção */}
      <div className="bg-[#F2F2F2] px-1 py-1 rounded-full flex flex-row gap-2">
        <button
          onClick={() => setActivePlan("Mensal")} 
          className={`${
            activePlan === "Mensal" ? "bg-[#060606] text-white" : "text-[#060606]"
          } font-bold py-2 px-12 rounded-full text-lg`}
        >
          <p>Mensal</p>
        </button>
        <button
          onClick={() => setActivePlan("Anual")} 
          className={`${
            activePlan === "Anual" ? "bg-[#060606] text-white" : "text-[#060606]"
          } font-bold py-2 px-8 rounded-full text-lg`}
        >
          <p>Anual</p>
        </button>
      </div>

      {/* Planos Mensais */}
      {activePlan === "Mensal" && (
        <div className="justify-center items-center flex flex-row gap-10 py-20">
          <PlansCards
            title={"Explorador"}
            isFree={true}
            isRecomendad={false}
            price={0.0}
            time={"mês"}
            topics={["Mapa do negócio", "Relatório Xperience", "Relatório SEO", "Mapa de maturidade"]}
            link={""}
          />
          <PlansCards
            title={"Inovador"}
            isFree={false}
            isRecomendad={false}
            price={0.0}
            time={"mês"}
            topics={["Sessão de análise do negócio 2h por mês", "Aprimoramento dos relatórios por especialistas"]}
            link={""}
          />
          <PlansCards
            title={"Notável"}
            isFree={false}
            isRecomendad={true}
            price={0.0}
            time={"mês"}
            topics={["Sessão de análise do negócio - 1h por semana", "Guia de planejamento e execução das ações"]}
            link={""}
          />
        </div>
      )}

      {/* Planos Anuais */}
      {activePlan === "Anual" && (
        <div className="justify-center items-center flex flex-row gap-10 py-20">
          <PlansCards
            title={"Explorador"}
            isFree={true}
            isRecomendad={false}
            price={0.0}
            time={"ano"}
            topics={["Mapa do negócio", "Relatório Xperience", "Relatório SEO", "Mapa de maturidade"]}
            link={""}
          />
          <PlansCards
            title={"Inovador"}
            isFree={false}
            isRecomendad={false}
            price={0.0}
            time={"ano"}
            topics={["Sessão de análise do negócio 2h por mês", "Aprimoramento dos relatórios por especialistas"]}
            link={""}
          />
          <PlansCards
            title={"Notável"}
            isFree={false}
            isRecomendad={true}
            price={0.0}
            time={"ano"}
            topics={["Sessão de análise do negócio - 1h por semana", "Guia de planejamento e execução das ações"]}
            link={""}
          />
        </div>
      )}
    </section>
  );
};

export default PlansSection;
