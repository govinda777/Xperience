import React from "react";
import ContactForm from "../../components/ContactForm";

const Contact: React.FC = () => {
  return (
    <main className="relative bg-white ">
      <div className="text-left md:text-center md:justify-center justify-left items-left md:items-center py-8 md:px-0 px-6 flex flex-col gap-4">
        <h1 className="font-extrabold w-64 md:w-0 text-4xl md:text-5xl">
          Pronto para simplificar e escalar seu negócio?
        </h1>
        <h2 className="font-extrabold text-4xl md:text-5xl text-[#F34A0D] w-64">
          {" "}
          Fale conosco agora mesmo!
        </h2>
      </div>
      <ContactForm isPageContact={true} />
    </main>
  );
};

export default Contact;
