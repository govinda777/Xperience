import React from "react";

const CommunitySection: React.FC = () => {
  const networkImage = new URL(
    "/public/home/community-network.png",
    import.meta.url,
  ).href;

  return (
    <div className="relative w-full md:py-0 py-14 min-0 md:min-h-screen bg-[#FFD54F] overflow-hidden">
      {/* Full screen background image */}
      <img
        src={networkImage}
        alt=""
        className="hidden md:block md:absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="relative z-10 w-full min-0 md:min-h-screen flex">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 grid-cols-1">
          {/* Empty space for image side */}
          <div className="md:block hidden" />

          {/* Content side */}
          <div className="pt-14 md:pt-32">
            {" "}
            {/* Adicionado padding-top para mover conteúdo para cima */}
            <h2 className="text-4xl md:text-5xl md:text-left text-center font-bold mb-6">
              {" "}
              {/* Reduzido margin-bottom */}
              Junte-se a nossa comunidade
            </h2>
            <p className="text-lg md:text-left text-center md:text-xl mb-6">
              {" "}
              {/* Reduzido margin-bottom */}
              Fazendo parte do Xperience você estará ajudando a construir uma
              comunidade empreendedora altamente engajada que se apoia e cresce
              de forma orgânica, numa relação de ganha ganha.
            </p>
            <p className="text-center md:text-left text-xl md:text-2xl font-bold mb-8">
              {" "}
              {/* Reduzido margin-bottom */}
              Um lugar onde todos se beneficiam!
            </p>
            <div className="flex md:justify-start justify-center">
              <button
                className="bg-[#E85D04]  text-white px-8 py-4 rounded-full text-xl
                            hover:bg-opacity-90 transition-colors duration-200"
              >
                Entre na nossa comunidade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
