import React from "react";
import { CheckCircle2 } from "lucide-react";

const ScheduleSection: React.FC = () => {
  const events = [
    {
      time: "09:00 - 16:30",
      title: "Escalada na Rocha",
      description: "Prática intensiva no Setor dos Fundos com orientação técnica constante.",
    },
    {
      time: "17:00 - 18:00",
      title: "Jantar",
      description: "Momento de confraternização e reposição de energias com gastronomia local.",
    },
    {
      time: "18:00",
      title: "Passeio ao Pôr do Sol",
      description: "Encerramento épico com a melhor vista panorâmica de Pedra Bela.",
    },
  ];

  return (
    <div className="w-full bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-black mb-16">
          Como será o seu dia
        </h2>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
          {events.map((event, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#F34A0D] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <CheckCircle2 size={20} />
              </div>
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-xl text-black">{event.title}</div>
                  <time className="font-mono text-sm font-bold text-[#F34A0D] bg-orange-50 px-3 py-1 rounded-full">
                    {event.time}
                  </time>
                </div>
                <div className="text-gray-600">{event.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSection;
