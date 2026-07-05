import React from "react";
import { MapPin, Clock, Info } from "lucide-react";

const LogisticsSection: React.FC = () => {
  return (
    <div className="w-full bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-8">
              Programação e Logística
            </h2>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed">
              Organização, segurança e profissionalismo são os nossos pilares.
              Garantimos que cada detalhe da sua aventura em Pedra Bela seja impecável,
              desde o ponto de encontro até ao encerramento das atividades.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#F34A0D]/10 p-3 rounded-lg">
                  <MapPin className="text-[#F34A0D] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Meeting Point</h3>
                  <p className="text-gray-600">Padaria São João de Pedra Bela</p>
                  <p className="text-sm text-gray-500">Rua Bernardino de Lima Paes, n.º 07 - Centro</p>
                  <a
                    href="https://maps.app.goo.gl/gpa6CQXj9JNVKGLe9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F34A0D] font-semibold hover:underline mt-2 inline-block"
                  >
                    Ver no Google Maps
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#F34A0D]/10 p-3 rounded-lg">
                  <Clock className="text-[#F34A0D] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Início da Atividade</h3>
                  <p className="text-gray-600">Chegada e início da caminhada/escalada às 08:45h.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#F34A0D]/10 p-3 rounded-lg">
                  <Clock className="text-[#F34A0D] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Encerramento</h3>
                  <p className="text-gray-600">Término na rocha às 17:00h (sujeito à meteorologia).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="text-[#F34A0D]" /> Pontos de Interesse
            </h3>
            <p className="text-gray-700 mb-8">
              Pedra Bela oferece opções incríveis para complementar o seu dia:
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-700">
                <span className="w-2 h-2 bg-[#F34A0D] rounded-full"></span>
                Restaurante Típico (gastronomia local)
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="w-2 h-2 bg-[#F34A0D] rounded-full"></span>
                Igreja Matriz de Pedra Bela
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="w-2 h-2 bg-[#F34A0D] rounded-full"></span>
                Tirolesa de 2km (uma das maiores do Brasil!)
              </li>
            </ul>
            <div className="mt-10">
              <a
                href="https://wa.me/5511999999999?text=Olá! Gostaria de falar com um guia certificado sobre a logística em Pedra Bela."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors"
              >
                Falar com Guia Certificado
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsSection;
