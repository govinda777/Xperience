import React from "react";
import { ShieldCheck, Mountain, Users } from "lucide-react";

const BeginnerSection: React.FC = () => {
  return (
    <div className="w-full bg-[#F8F9FA] py-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">
          Nunca Escalou?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A sua curiosidade é o nosso ponto de partida. Desenhamos esta experiência
          especialmente para quem tem zero experiência, mas muita vontade de superar limites.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
            <ShieldCheck className="text-[#F34A0D] w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Segurança Absoluta</h3>
          <p className="text-gray-600 leading-relaxed">
            Mitigamos hesitações através de protocolos rigorosos e equipamentos de ponta.
            O nosso foco é o seu acolhimento e tranquilidade.
          </p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition-shadow border-2 border-transparent hover:border-[#F34A0D]/10">
          <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
            <Mountain className="text-[#F34A0D] w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Campo Escola</h3>
          <p className="text-gray-600 leading-relaxed">
            O "Setor dos Fundos" é o nosso Campo Escola de Escalada.
            Vias de nível fácil, ideais para o seu primeiro contato com a rocha.
          </p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
            <Users className="text-[#F34A0D] w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Acesso Facilitado</h3>
          <p className="text-gray-600 leading-relaxed">
            Sem trilhos exaustivos: apenas 3 minutos de caminhada leve até à base das vias.
            Foco total na escalada!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-20 text-center">
        <div className="bg-black text-white p-12 rounded-[40px] relative overflow-hidden">
          <div className="relative z-10">
            <blockquote className="text-2xl md:text-3xl font-medium italic mb-8">
              "A superação pessoal começa onde o medo termina. Na rocha, descobrimos
              que somos capazes de muito mais do que imaginamos."
            </blockquote>
            <p className="text-[#F34A0D] text-3xl font-bold uppercase tracking-widest">
              Só o cume importa!
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F34A0D]/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default BeginnerSection;
