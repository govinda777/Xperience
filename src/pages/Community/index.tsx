import React from "react";
import PeoplesCommunity from "../../../assets/peoplesCommunity.png";
import Logo from "../../../assets/logo.svg";
import { ArrowRight } from "lucide-react";
import ChevronsRight2 from "../../../assets/svg/chevronsRight2.svg";
import Rabisco2 from "../../../assets/svg/rabisco2.svg";
import EmojisDesktop from "../../../assets/svg/emojisDesktop.svg";
import EmojisMobile from "../../../assets/svg/emojisMobile.svg";
import Cards from "./Cards";
import SEOHead from "../../components/SEOHead";

const Community: React.FC = () => {
  return (
    <main className="relative bg-white">
      <SEOHead
        title="Comunidade Empreendedora | Xperience"
        description="Faça parte de uma comunidade empreendedora engajada. Compartilhe problemas, receba sugestões, encontre fornecedores e faça parcerias de sucesso."
        keywords="comunidade empreendedora, networking, parcerias, fornecedores, compra coletiva, posicionamento de mercado"
        ogImage="/community/hero.png"
        canonical="https://xperience.com.br/community"
      />
      <div className="relative flex flex-col justify-start items-center">
        <img
          src={PeoplesCommunity}
          alt="Pessoas se abraçando"
          className="w-full"
        />

        <div className="absolute flex flex-col gap-2 md:gap-3 pt-7 md: xl:pt-32">
          <h1 className="md:text-2xl xl:text-3xl text-xl text-center">
            Comunidade
          </h1>
          <img
            src={Logo}
            alt="Pessoas sorrindo"
            className="w-32 md:w-[300px] xl:w-[500px]"
          />
          <div className="flex justify-center items-center">
            <button className="bg-[#1a1a1a] rounded-[20px] px-5 py-4 md:py-4 hidden md:flex items-center justify-center gap-4">
              <p className="md:text-1xl xl:text-2xl flex flex-col md:flex-row font-bold relative gap-3 text-white">
                Juntar-se a comunidade
              </p>
              <ArrowRight className="xl:h-6 xl:w-6 h-5 text-white" />
            </button>
          </div>
        </div>
        <div className="bg-white mx-auto py-3 md:hidden">
          <button className="bg-[#1a1a1a] rounded-[20px] py-4 px-6 flex items-center justify-center gap-4">
            <p className="text-lg md:text-2xl flex flex-col md:flex-row font-bold relative gap-3 text-white">
              Juntar-se a comunidade
            </p>
            <ArrowRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#F34A0D] via-[#F34A0D] via-90% to-[#F9F9F9] py-20 md:px-60 px-8">
        <div className="flex flex-col justify-start md:justify-center items-start md:items-center gap-4">
          <h1 className="text-3xl md:text-6xl text-center text-white md:font-regular font-extrabold">
            Faça parte de uma{" "}
          </h1>
          <h1 className="flex-col gap-2 flex text-4xl md:text-6xl font-extrabold text-white md:text-center md:justify-center md:items-center">
            comunidade empreendedora
            <img src={Rabisco2} alt="Rabisco" className="md:w-[85%] w-[85%]" />
          </h1>
        </div>
        <div className="gap-10 flex flex-col">
          <p className="text-lg md:text-2xl text-white pt-14">
            Fazendo parte do Xperience você estará ajudando a construir uma
            comunidade empreendedora altamente engajada que se apoia e cresce de
            forma orgânica, numa relação de ganha ganha, onde todos se
            beneficiam.
          </p>
          <div className="flex flex-col">
            <div className="flex flex-col gap-8">
              <li className="flex gap-2 items-center">
                <img
                  src={ChevronsRight2}
                  alt="Setas Tópico"
                  className="h-8 w-8"
                />
                <p className="text-xl md:text-2xl text-white font-bold">
                  Compartilhe o seu problema com a comunidade e receba
                  sugestões.
                </p>
              </li>
              <li className="flex gap-2 items-center">
                <img
                  src={ChevronsRight2}
                  alt="Setas Tópico"
                  className="h-8 w-8"
                />
                <p className="text-xl md:text-2xl text-white font-bold">
                  Compartilhe fornecedores.
                </p>
              </li>
              <li className="flex gap-2 items-center">
                <img
                  src={ChevronsRight2}
                  alt="Setas Tópico"
                  className="h-8 w-8"
                />
                <p className="text-xl md:text-2xl text-white font-bold">
                  Faça uma compra coletiva.
                </p>
              </li>
            </div>
            <img
              src={EmojisDesktop}
              alt="Emojis"
              className="w-full md:block hidden"
            />
            <img
              src={EmojisMobile}
              alt="Emojis"
              className="w-72 block md:hidden mx-auto"
            />
          </div>
        </div>
        <div className="py-7 flex flex-col">
          <h1 className="text-white text-4xl md:text-5xl font-extrabold md:font-bold">
            Além das ferramentas, torne-se um filiado e participe de um ambiente
            que busca...
          </h1>
        </div>
        <div className="flex flex-col gap-6">
          <Cards
            title="Posicionamento de mercado"
            subtitle="Torne seus concorrentes insignificantes."
            isCircle={true}
          />
          <Cards
            title="Identificação de necessidades"
            subtitle="Descubra novas demandas dos seus clientes."
          />
          <Cards
            title="Fortalecer relações"
            subtitle="Conheça pessoas, estreite laços e faça parcerias de sucesso."
          />
        </div>
        <div className="pt-10 flex justify-center items-center">
          <button className="bg-[#1a1a1a] rounded-[20px] px-6 py-4 md:py-5 flex items-center justify-center gap-4">
            <p className="text-xl md:text-2xl flex flex-col md:flex-row font-bold relative gap-3 text-white">
              Juntar-se a comunidade
            </p>
            <ArrowRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Community;
