import React from "react";
import Peoples from "../../../public/HeroQuemSomos.png";
import CirclePeoples from "../../../public/CiclePeoples.png";

const About: React.FC = () => {
  return (
    <main className="relative bg-white">
      <div className="">
        <div className="relative">
          <img src={Peoples} alt="Pessoas sorrindo" className="w-full" />
        </div>
      </div>
      <section className="px-4 md:px-32 pt-20">
        <h1 className="text-[#F34A0D] font-bold md:text-7xl text-4xl w-auto md:pr-0 pr-7 xl:w-[1280px]">
          Inovação, praticidade e resultados imediatos
        </h1>
        <div className="gap-8 md:gap-16 pt-10 md:pt-14 flex flex-col text-[#1a1a1a] text-base md:text-3xl">
          <p className="">
            A Xperience Consultoria Empresarial nasceu para trazer soluções
            práticas e descomplicadas para pequenos empreendedores.{" "}
          </p>
          <p className="">
            Sabemos que a rotina de quem está à frente de um negócio é intensa,
            e nossa missão é{" "}
            <span className="font-bold">
              simplificar processos, aliviar dores e potencializar resultados de
              forma rápida e acessível.
            </span>
          </p>
          <p className="">
            Com uma equipe de especialistas transformamos negócios com inovação
            e estratégias personalizadas para cada cliente.
          </p>
        </div>
        <div className="relative pt-12 md:pt-28">
          <img
            src={CirclePeoples}
            alt="Circulo de pessoal reunião"
            className="w-full"
          />
        </div>
      </section>
    </main>
  );
};

export default About;
