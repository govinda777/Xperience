import { useState, useRef, useEffect } from "react";
import PlansCards from "../PlansCards";
import PaginationDots from "../PlainationsDots";

const plans = [
  {
    title: "Explorador",
    isFree: true,
    isRecomendad: false,
    price: 0.0,
    topics: [
      "Mapa do negócio",
      "Relatório Xperience",
      "Relatório SEO",
      "Mapa de maturidade",
    ],
    link: "#",
  },
  {
    title: "Inovador",
    isFree: false,
    isRecomendad: false,
    price: 100.0,
    topics: [
      "Sessão de análise do negócio 2h por mês",
      "Aprimoramento dos relatórios por especialistas",
    ],
    link: "#",
  },
  {
    title: "Notável",
    isFree: false,
    isRecomendad: true,
    price: 200.0,
    topics: [
      "Sessão de análise do negócio - 1h por semana",
      "Guia de planejamento e execução das ações",
    ],
    link: "#",
  },
];

const PlansSectionEssential = () => {
  const [activePlan, setActivePlan] = useState("Mensal");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const percentage = 20;

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 350, behavior: "smooth" });

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / 300);
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="flex flex-col justify-center items-center w-full relative">
      {/* Botões de Seleção */}
      <div className="bg-[#F2F2F2] p-2 rounded-full flex flex-row gap-2">
        <button
          onClick={() => setActivePlan("Mensal")}
          className={`${
            activePlan === "Mensal"
              ? "bg-[#060606] text-white"
              : "text-[#060606]"
          } font-bold py-3 px-12 rounded-full text-lg md:text-xl`}
        >
          Mensal
        </button>
        <button
          onClick={() => setActivePlan("Anual")}
          className={`${
            activePlan === "Anual"
              ? "bg-[#060606] text-white"
              : "text-[#060606]"
          } font-bold py-3 px-8 rounded-full text-lg md:text-xl`}
        >
          Anual{" "}
          <span
            className={`${
              activePlan === "Anual" ? "text-white" : "text-[#D00F0F]"
            } font-normal text-sm md:text-base`}
          >
            -{percentage}% off
          </span>
        </button>
      </div>

      {/* Planos Essenciais*/}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-10 py-24 md:px-28 px-8 md:w-auto w-full scroll-smooth"
      >
        {plans.map((plan, index) => (
          <div key={index} className="shrink-0 min-w-[280px] md:min-w-[320px]">
            <PlansCards
              {...plan}
              category="Essential"
              time={activePlan === "Mensal" ? "mês" : "ano"}
              price={plan.price}
              percentage={activePlan === "Anual" ? percentage : 0}
            />
          </div>
        ))}
      </div>

      {/* Paginação */}
      <PaginationDots
        total={plans.length}
        activeIndex={activeIndex}
        onPrev={scrollLeft}
        onNext={scrollRight}
      />
    </section>
  );
};

export default PlansSectionEssential;
