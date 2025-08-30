import React from "react";
import LightBulb from "../../../assets/svg/lightBulb.svg";
import Surprised from "../../../assets/svg/surprised.svg";
import Slice from "../../../assets/svg/slice.svg";

interface EnjoyToolsProps {
  link: string;
}

const EnjoyTools: React.FC<EnjoyToolsProps> = ({ link }) => {
  return (
    <section className="w-full bg-white py-24 flex flex-col gap-20 md:gap-10 relative">
      <img
        src={Slice}
        alt="Pedaço bola"
        className="w-24 h-24 md:w-40 md:h-40 absolute md:-top-2.5 -top-1.5 -left-0 md:left-0"
      />

      <h1 className="text-[#1a1a1a] font-extrabold w-80 md:w-auto text-4xl md:text-5xl text-center mx-auto">
        Quer aproveitar nossa ferramenta{" "}
        <span className="italic uppercase text-[#F34A0D]">gratuita?!</span>
      </h1>

      <div className="flex flex-col justify-center items-center gap-8">
        <img
          src={LightBulb}
          alt="Rabisco"
          className="md:w-64 md:h-64 w-56 h-56"
        />
        <div className="flex flex-col gap-1">
          <p className="text-[#1a1a1a] font-extrabold text-3xl text-center">
            IA do Empreendedor
          </p>

          <p className="italic text-2xl text-center">chatbot Xperience</p>
        </div>
      </div>

      <div className="justify-center items-center flex mt-3">
        <div className="relative">
          <a
            href="https://ai-entrepreneur-connect.replit.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1a1a1a] rounded-[20px] py-4 md:py-5 px-12 md:px-7 inline-block"
          >
            <p className="text-2xl flex flex-col md:flex-row font-bold relative gap-3 text-white">
              Comece a explorar
            </p>
            <img
              src={Surprised}
              alt="Ícone Surpreso"
              className="w-20 absolute -top-14 -right-12 md:block hidden transform rotate-90"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default EnjoyTools;
