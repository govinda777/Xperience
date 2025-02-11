import React from "react";
import Check from "../../../../assets/svg/check.svg";
import { Link } from "react-router-dom";
import Crown from "../../../../assets/svg/crown.svg";
import Scribble from "../../../../assets/svg/rabisco2.svg";
import Plus from "../../../../assets/svg/plus.svg";

interface PlansCardsProps {
  category: "Essential" | "Expert";
  title: string;
  isFree?: boolean;
  isRecomendad: boolean;
  price: number;
  time: "mês" | "ano";
  topics: string[];
  percentage?: number;
  link: string;
}

const PlansCards: React.FC<PlansCardsProps> = ({
  category,
  title,
  isFree,
  isRecomendad,
  price,
  percentage,
  time,
  topics,
  link,
}) => {
  /* Lógica para quantidade de consultas */
  const queries =
    title === "Explorador"
      ? 10
      : title === "Inovador"
      ? 10
      : title === "Notável"
      ? 30
      : 50;

  /* Lógica para descontos */
  const discountAmount = percentage ? (price * percentage) / 100 : 0;
  const priceDiscount = price - discountAmount;

  /* Lógica para total a partir dos meses e preço */
  const months =
    title === "Extraordinário"
      ? 3
      : title === "Extraordinário Diamante"
      ? 6
      : title === "Extraordinário Rubi"
      ? 12
      : 0;
  const total = price * months;

  return (
    <>
      {category === "Essential" ? (
        <div
          className={`h-full  relative md:gap-10 gap-8 justify-center flex flex-col py-8 px-6 rounded-[30px] bg-white max-w-xs md:max-w-xl border-4 ${
            isRecomendad ? "border-[#CC3600]" : "border-[#F2F2F2]"
          }`}
        >
          {/* TAG */}
          {isRecomendad && (
            <div className="py-2 px-6 bg-[#CC3600] rounded-full absolute -top-5 left-1/2 transform -translate-x-1/2">
              <p className="text-white uppercase font-bold text-lg">
                Recomendado
              </p>
            </div>
          )}

          {/* Coroa */}
          {isRecomendad && (
            <div className="absolute md:-top-24 md:-right-16 -top-20 -right-10 transform">
              <img
                src={Crown}
                alt="Coroa"
                className="md:w-28 md:h-28 w-20 h-20"
              />
            </div>
          )}

          {/* Título */}
          <h1 className="text-xl md:text-2xl font-bold text-[#F34A0D]">
            {title}
          </h1>

          {/* Precificação */}
          <div className="">
            {isFree ? (
              <h1 className="text-4xl md:text-5xl font-bold text-[#060606] mb-4 uppercase">
                Free
              </h1>
            ) : (
              <>
                {/* Desconto */}
                {percentage != 0 && (
                  <div className="items-center flex flex-row gap-2 mb-4">
                    <h1 className="text-[#1a1a1a] text-base md:text-lg font-light">
                      De R$
                      <span className="line-through decoration-[#CC3600]">
                        {" "}
                        {price.toFixed(2)}
                      </span>{" "}
                      por
                    </h1>
                    <p className="p-2 bg-[#008205] text-white font-extrabold rounded-full text-xs md:text-sm">
                      - R$ {discountAmount.toFixed(2)} no total
                    </p>
                  </div>
                )}

                <div className="mb-4 flex flex-row gap-2 items-end ">
                  <h1 className="text-4xl md:text-5xl font-bold text-[#060606]">
                    R${" "}
                    {percentage ? priceDiscount.toFixed(2) : price.toFixed(2)}
                  </h1>
                  <h2 className="font-light text-sm md:text-lg text-[#B9BEC1]">
                    / {time}
                  </h2>
                </div>
              </>
            )}
          </div>

          {/* Tópico Principal */}
          <div className="flex flex-row gap-2 items-center">
            <img src={Check} alt="Check" className="md:w-5 md:h-5 mt-0.5" />
            <p className="text-[#1A1A1A]">
              <span className="font-bold">{queries} consultas</span> por mês da
              IA do Empreendedor
            </p>
          </div>

          {/* Tópicos */}
          <ul className="flex flex-col gap-4 mt-9">
            {isFree ? (
              <h3 className="text-[#060606]">Benefícios</h3>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-[#060606]">
                  <span className="font-bold">TUDO</span> do plano
                </h2>
                <div className="flex gap-1">
                  <div className="flex flex-col">
                    <h3 className="text-lg text-[#F34A0D] font-bold">
                      Explorador
                    </h3>
                    <img src={Scribble} alt="Rabisco" className="w-[90%]" />
                  </div>
                  <img src={Plus} alt="ícone Mais" className="w-5 h-5 mt-1" />
                </div>
              </div>
            )}
            {topics.map((topic, index) => (
              <div
                key={index}
                className="flex flex-row gap-2 items-start justify-start w-64"
              >
                <img src={Check} alt="Check" className="md:w-5 md:h-5" />
                <p className="text-[#1A1A1A]">{topic}</p>
              </div>
            ))}
          </ul>
          <div className="mt-auto mx-auto">
            <Link
              to={link}
              className={`py-4 px-9 text-sm text-white ${
                isRecomendad ? "bg-[#F34A0D]" : "bg-[#060606]"
              } rounded-full flex items-center justify-center hover:bg-opacity-85`}
            >
              <p className="text-sm font-bold">Eu quero este</p>
            </Link>
          </div>
        </div>
      ) : (
        <div
          className={`h-full relative md:gap-10 gap-8 justify-center flex flex-col py-8 px-6 rounded-[30px] bg-white max-w-xs md:max-w-xl border-4 ${
            isRecomendad ? "border-[#CC3600]" : "border-[#F2F2F2]"
          }`}
        >
          {/* TAG */}
          {isRecomendad && (
            <div className="py-2 px-6 bg-[#CC3600] rounded-full absolute -top-5 left-1/2 transform -translate-x-1/2">
              <p className="text-white uppercase font-bold text-lg">
                Recomendado
              </p>
            </div>
          )}

          {/* Coroa */}
          {isRecomendad && (
            <div className="absolute md:-top-24 md:-right-16 -top-20 -right-10 transform ">
              <img
                src={Crown}
                alt="Coroa"
                className="md:w-28 md:h-28 w-20 h-20"
              />
            </div>
          )}

          {/* Título */}
          <h1 className="text-xl md:text-2xl font-bold text-[#F34A0D]">
            {title}
          </h1>

          {/* Precificação */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[#060606] md:text-base text-sm">
              Equivalente a
            </h3>
            <div className="mb-4 flex flex-row gap-2 items-end">
              <h1 className="text-4xl md:text-5xl font-bold text-[#060606]">
                R$ {percentage ? priceDiscount.toFixed(2) : price.toFixed(2)}
              </h1>
              <h2 className="font-light text-sm md:text-lg text-[#B9BEC1]">
                / {time}
              </h2>
            </div>
            <h2 className="md:text-xl text-base">Total de R${total}</h2>
            <div className="inline-flex items-center">
              <h2 className="bg-[#F3D00D] font-light py-3 px-5 rounded-full bg-opacity-50">
                Válido por <span className="font-bold">{months} meses</span>
              </h2>
            </div>
          </div>

          {/* Tópico Principal */}
          <div className="flex flex-row gap-2 items-center">
            <img src={Check} alt="Check" className="md:w-5 md:h-5 mt-0.5" />
            <p className="text-[#1A1A1A]">
              <span className="font-bold">{queries} consultas</span> por mês da
              IA do Empreendedor
            </p>
          </div>

          {/* Tópicos */}
          <ul className="flex flex-col gap-4 mt-9">
            <div className="flex flex-col">
              <h2 className="text-[#060606]">
                <span className="font-bold">TUDO</span> do plano
              </h2>
              <div className="flex gap-1">
                <div className="flex flex-col">
                  <h3 className="text-lg text-[#F34A0D] font-bold">
                    Explorador
                  </h3>
                  <img src={Scribble} alt="Rabisco" className="w-[90%]" />
                </div>
                <img src={Plus} alt="ícone Mais" className="w-5 h-5 mt-1" />
              </div>
            </div>

            {topics.map((topic, index) => (
              <div
                key={index}
                className="flex flex-row gap-2 items-start justify-start w-64 md:w-80"
              >
                <img src={Check} alt="Check" className="md:w-5 md:h-5" />
                <p className="text-[#1A1A1A]">{topic}</p>
              </div>
            ))}
          </ul>
          <div className="mt-auto mx-auto">
            <Link
              to={link}
              className={`py-4 px-9 text-sm text-white ${
                isRecomendad ? "bg-[#F34A0D]" : "bg-[#060606]"
              } rounded-full flex items-center justify-center hover:bg-opacity-85`}
            >
              <p className="text-sm font-bold">Eu quero este</p>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default PlansCards;
