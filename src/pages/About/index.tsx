import React from "react";
import Peoples from "../../../assets/HeroQuemSomos.png";
import CirclePeoples from "../../../assets/CiclePeoples.png";
import Slice from "../../../assets/svg/slice.svg";
import ChevronsRight from "../../../assets/svg/chevronsRight.svg";
import EmojiSurprise from "../../../assets/svg/emojiSurprise.svg";
import Rabisco from "../../../assets/svg/rabisco.svg";
import Couple from "../../../assets/couple.png";
import Surprised from "../../../assets/svg/surprised.svg";

const About: React.FC = () => {
  return (
    <main className="relative bg-white">
      <div className="">
        <div className="relative">
          <img src={Peoples} alt="Pessoas sorrindo" className="w-full" />
        </div>
      </div>
      <section className="relative px-4 md:px-32 pt-10 md:pt-20">
        <img
          src={Slice}
          alt="Pedaço bola"
          className="w-24 h-24 md:w-40 md:h-40 absolute md:top-0 -top-0 -right-2 rotate-90 md:-right-3"
        />
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
      <div className="bg-[#FBE151] gap-8 flex flex-col px-4 md:px-32 pt-10 pb-72 md:py-20 relative">
        <div className="flex md:flex-row flex-col justify-between md:items-center relative">
          <img
            src={EmojiSurprise}
            alt="Circulo de pessoal reunião"
            className="w-40 md:w-72"
          />
          <div className="flex flex-col md:flex-row gap-3 text-right">
            {/* Texto + Rabisco */}
            <h1 className="text-5xl md:text-6xl flex flex-col sm:flex-row md:flex-row font-bold relative gap-3">
              Como nos
            </h1>
            <h1 className="flex-col gap-2 flex text-5xl md:text-6xl font-bold md:items-start items-end">
              definimos?!
              <img src={Rabisco} alt="Rabisco" className="md:w-[85%] w-[70%]" />
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-4xl md:text-5xl">Nossa Missão</h1>
          <p className="text-lg md:text-xl">
            Tornar a vida do pequeno empreendedor mais fácil, oferecendo
            soluções práticas que geram resultados imediatos.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-4xl md:text-5xl">Nossa Visão</h1>
          <p className="text-lg md:text-xl">
            Ser referência em consultoria acessível e eficiente, ajudando
            pequenos negócios a prosperarem com inovação.
          </p>
        </div>
        <div className="gap-4 flex flex-col pb-22">
          <h1 className="font-bold text-4xl md:text-5xl">Nossos Valores</h1>
          <li className="flex gap-2 items-center">
            <img src={ChevronsRight} alt="Setas Tópico" className="h-8 w-8" />
            <p className="text-xl md:text-2xl">Inovação</p>
          </li>
          <li className="flex gap-2 items-center">
            <img src={ChevronsRight} alt="Setas Tópico" className="h-8 w-8" />
            <p className="text-xl md:text-2xl">Praticidade</p>
          </li>
          <li className="flex gap-2 items-center">
            <img src={ChevronsRight} alt="Setas Tópico" className="h-8 w-8" />
            <p className="text-xl md:text-2xl">Resultados rápidos</p>
          </li>
          <li className="flex gap-2 items-center">
            <img src={ChevronsRight} alt="Setas Tópico" className="h-8 w-8" />
            <p className="text-xl md:text-2xl">Colaboração</p>
          </li>
          <li className="flex gap-2 items-center">
            <img src={ChevronsRight} alt="Setas Tópico" className="h-8 w-8" />
            <p className="text-xl md:text-2xl">Confiança</p>
          </li>
        </div>
        <div className="justify-start items-start flex mt-3">
          <div className="relative">
            <button className="bg-[#1a1a1a] rounded-[20px] py-4 md:py-5 px-12 md:px-7">
              <p className="text-xl md:text-2xl flex flex-col md:flex-row font-bold relative gap-3 text-white">
                Agendar mentoria
              </p>
              <img
                src={Surprised}
                alt="Ícone Surpreso"
                className="w-16 md:w-20 absolute md:-top-14 -top-10 md:-right-12 -right-10 transform rotate-90"
              /> 
            </button>
          </div>
        </div>
        <img
          src={Couple}
          alt="Casal"
          className="md:w-auto absolute -right-1 -bottom-1"
        />
      </div>
    </main>
  );
};

export default About;
