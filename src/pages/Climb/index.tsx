import React from "react";
import ClimbHero from "./components/ClimbHero";
import LogisticsSection from "./components/LogisticsSection";
import BeginnerSection from "./components/BeginnerSection";
import ScheduleSection from "./components/ScheduleSection";
import SEOHead from "../../components/SEOHead";
import ContactForm from "../../components/ContactForm";

const ClimbPage: React.FC = () => {
  return (
    <div className="bg-white">
      <SEOHead
        title="Xperience Climb | Escalada Guiada em Pedra Bela"
        description="Viva a exclusividade da escalada guiada em Pedra Bela. Experiências seguras para iniciantes e grupos corporativos. Só o cume importa!"
        keywords="escalada pedra bela, xperience climb, batismo de escalada, team building outdoor, escalada são paulo"
        ogImage="/home/hero.png"
        canonical="https://climb.xperiencehubs.com/"
      />

      <ClimbHero />

      <div id="beginner">
        <BeginnerSection />
      </div>

      <div id="schedule">
        <ScheduleSection />
      </div>

      <div id="logistics">
        <LogisticsSection />
      </div>

      <div className="bg-[#F8F9FA] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
            Pronto para o Próximo Nível?
          </h2>
          <p className="text-xl text-gray-600">
            Entre em contacto connosco e reserve a sua data.
          </p>
        </div>
        <ContactForm isPageContact={true} />
      </div>
    </div>
  );
};

export default ClimbPage;
