import React from "react";
import ContactForm from "../../components/ContactForm";
import SEOHead from "../../components/SEOHead";

const Contact: React.FC = () => {
  return (
    <main className="relative bg-white">
      <SEOHead
        title="Contato | Xperience - Fale Conosco"
        description="Entre em contato com a Xperience. Estamos prontos para ajudar a simplificar e escalar seu negócio com nossas soluções personalizadas."
        keywords="contato xperience, fale conosco, consultoria empresarial, orçamento, atendimento"
        ogImage="/contact/hero.png"
        canonical="https://xperience.com.br/contact"
      />
      <div className="text-left md:text-center md:justify-center justify-left items-left md:items-center py-8 md:px-0 px-6 flex flex-col gap-4">
        <h1 className="font-extrabold w-64 md:w-auto text-4xl md:text-5xl">
          Pronto para simplificar e escalar seu negócio?
        </h1>
        <h2 className="font-extrabold text-4xl md:text-5xl text-[#F34A0D] w-64 md:w-auto">
          {" "}
          Fale conosco agora mesmo!
        </h2>
      </div>
      <ContactForm isPageContact={true} />
    </main>
  );
};

export default Contact;
