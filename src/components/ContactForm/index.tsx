import React, { useState } from "react";
import Peoples from "../../../public/peoples.png";

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  contactPreference: string[];
  businessSegment: string;
  needs: string;
  agreeToTerms: boolean;
}

interface ContactFormProps {
  isPageContact?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ isPageContact }) => {
  const [formData, setFormData] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    contactPreference: [],
    businessSegment: "",
    needs: "",
    agreeToTerms: false,
  });

  const [characterCount, setCharacterCount] = useState(0);

  const handlePreferenceToggle = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      contactPreference: prev.contactPreference.includes(preference)
        ? prev.contactPreference.filter((p) => p !== preference)
        : [...prev.contactPreference, preference],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const img = new URL("/public/home/contact-form.png", import.meta.url).href;
  return (
    <div className="w-full h-auto md:h-screen bg-[#F9F6F1] relative overflow-hidden">
      <div className="block md:hidden p-6">
        <div className="relative">
          <img
            src={Peoples}
            alt="Pessoas sorrindo"
            className="relative z-10 h-auto"
          />
        </div>
      </div>
      <div className="max-w-none px-4 md:pr-0 md:pl-[calc((100%-74rem)/2)] h-full flex items-center md:flex-row flex-col">
        {/* Form Section */}
        <div className="max-w-md relative z-10">
          <h2 className="text-3xl font-bold mb-2 py-7 md:py-0">
            Vamos nos conhecer?!
          </h2>
          <p className="text-gray-600 mb-6 text-base w-[370px]">
            Preencha as informações e nossos especialistas irão entrar em
            contato com você
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome"
              className="w-full px-4 py-3 rounded-full border-2 border-[#A3A3A3] focus:outline-none bg-white"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-4 py-3 rounded-full border-2 border-[#A3A3A3] focus:outline-none bg-white"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />

            <input
              type="tel"
              placeholder="Telefone"
              className="w-full px-4 py-3 rounded-full border-2 border-[#A3A3A3] focus:outline-none bg-white"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />

            <div className="space-y-2">
              <div className="flex items-center gap-7">
                <span className="text-gray-800">Preferência de contato</span>
                <span className="text-gray-400 text-sm">(Opcional)</span>
              </div>
              <div className="flex gap-2">
                {[
                  { label: "E-mail", value: "email" },
                  { label: "Telefone", value: "phone" },
                  { label: "WhatsApp", value: "whatsapp" },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handlePreferenceToggle(value)}
                    className={`px-4 py-2 rounded-full border-2 transition-colors bg-white font-bold text-[#F34A0D] hover:bg-[#F34A0D] hover:text-white border-[#F34A0D]
                      ${
                        formData.contactPreference.includes(value)
                          ? "bg-orange-600 border-orange-600 text-white"
                          : ""
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <select
              className="w-full px-4 py-3 rounded-full border-2 border-[#A3A3A3] focus:outline-none appearance-none bg-white"
              value={formData.businessSegment}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  businessSegment: e.target.value,
                }))
              }
            >
              <option value="">Segmento do seu negócio</option>
              <option value="retail">Varejo</option>
              <option value="services">Serviços</option>
              <option value="food">Alimentação</option>
            </select>

            <div className="relative">
              <textarea
                placeholder="Explique sua necessidade"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#A3A3A3] focus:outline-none resize-none h-28"
                value={formData.needs}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= 100) {
                    setFormData((prev) => ({ ...prev, needs: text }));
                    setCharacterCount(text.length);
                  }
                }}
              />
              <span className="absolute bottom-3 right-4 text-sm text-gray-400">
                {characterCount}/100
              </span>
            </div>

            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeToTerms: e.target.checked,
                  }))
                }
                className="rounded border-gray-300"
              />
              <span>Concordo em receber informações</span>
            </label>
            <div className="pb-5">
              <button
                type="submit"
                className="w-full bg-black text-white rounded-2xl py-4  font-bold hover:bg-opacity-90 transition-colors"
              >
                Enviar mensagem
              </button>
            </div>
          </form>
        </div>
        {isPageContact ? (
          <>
            <div className="hidden md:block pl-72">
              <div className="relative">
                <img
                  src={Peoples}
                  alt="Pessoas sorrindo"
                  className="relative z-10 h-auto"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Image Section - Desktop */}
            <div className="absolute right-0 bottom-0 hidden md:block">
              <div className="relative">
                <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full bg-orange-500 translate-x-1/4 translate-y-1/4" />
                <img
                  src={img}
                  alt="Pessoa sorrindo"
                  className="relative z-10 w-[400px] h-auto"
                />
              </div>
            </div>

            {/* Image Section - Mobile */}
            <div className="block md:hidden relative w-full mt-8">
              <div className="relative flex justify-end -right-4">
                {/*  <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-orange-500" /> */}
                <img
                  src={img}
                  alt="Pessoa sorrindo"
                  className="relative z-10 w-full max-w-[300px] -rigth-8"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
