import { useState, useRef, useEffect } from "react";
import PlansCards from "../PlansCards";
import PaginationDots from "../PlainationsDots";

const plans = [
  {
    title: "Extraordinário",
    isRecomendad: false,
    time: "mês",
    price: 100.0,
    topics: [
      "Mentorias especializadas - 2h por semana",
      "1 Sessão de mentoria master de 4h de visão 360 do negócio",
      "1 Sessão master de 4h para Treinamento de equipe"
    ],
    link: "#",
  },
  {
    title: "Extraordinário Diamante",
    isRecomendad: true,
    time: "mês",
    price: 100.0,
    topics: [
      "Mentorias especializadas - 4h a cada 15 dias",
      "1 Sessão de mentoria master de 4h de visão 360 do negócio",
      "1 Sessão master de 2h de Marketing digital",
      "1 Sessão master de 2h de Tecnologia, IA e Automação de processos",
    ],
    link: "#",
  },
  {
    title: "Extraordinário Rubi",
    isRecomendad: false,
    time: "mês",
    price: 200.0,
    topics: [
      "Mentorias especializadas - 2h por semana",
      "1 Sessão de mentoria master de 4h de visão 360 do negócio",
      "1 Sessão master de 4h para Treinamento de equipe"
    ],
    link: "#",
  },
];

const PlansSectionExpert = () => {
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
   
      {/* Planos Expert*/}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-10 py-24 md:px-28 px-8 md:w-auto w-full scroll-smooth"
      >
        {plans.map((plan, index) => (
          <div key={index} className="shrink-0 min-w-[280px] md:min-w-[320px]">
            <PlansCards
              {...plan}
              category="Expert"
              time={plan.time as "mês" | "ano"}
              price={plan.price}
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

export default PlansSectionExpert;
