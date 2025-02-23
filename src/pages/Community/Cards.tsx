import React from "react";
import Slice from "../../../assets/svg/slice.svg";

interface CardsProps {
  title: string;
  subtitle: string;
  isCircle?: boolean;
}

const Cards: React.FC<CardsProps> = ({ title, subtitle, isCircle }) => {
  return (
    <main className="w-full bg-white relative p-10 rounded-3xl md:rounded-2xl regular">
      {isCircle && (
        <img
          src={Slice}
          alt="Pedaço bola"
          className="w-24 h-24 md:w-40 md:h-40 absolute md:-top-10 -top-0 -right-2 rotate-90 md:-right-8"
        />
      )}
      <div className="flex flex-col gap-2 text-[#1A1A1A]">
        <h1 className="font-bold text-3xl md:text-xl w-60">{title}</h1>
        <h2 className="font-semibold text-lg">{subtitle}</h2>
      </div>
    </main>
  );
};

export default Cards;
