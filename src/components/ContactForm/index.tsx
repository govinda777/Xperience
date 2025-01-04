import React, { useState } from 'react';

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  contactPreference: string[];
  businessSegment: string;
  needs: string;
  agreeToTerms: boolean;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    contactPreference: [],
    businessSegment: '',
    needs: '',
    agreeToTerms: false
  });

  const [characterCount, setCharacterCount] = useState(0);

  const handlePreferenceToggle = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      contactPreference: prev.contactPreference.includes(preference)
        ? prev.contactPreference.filter(p => p !== preference)
        : [...prev.contactPreference, preference]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const img = new URL('/public/home/contact-form.png', import.meta.url).href;
  return (
    <div className="w-full h-screen bg-[#F8F8F8] relative overflow-hidden">
      <div className="max-w-none px-4 md:pr-0 md:pl-[calc((100%-74rem)/2)] h-full flex items-center">
        {/* Form Section */}
        <div className="max-w-xl relative z-10">
          <h2 className="text-2xl font-medium mb-2">Vamos nos conhecer?!</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Preencha as informações e nossos especialistas irão entrar em contato
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome"
              className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />

            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />

            <input
              type="tel"
              placeholder="Telefone"
              className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-800">Preferência de contato</span>
                <span className="text-gray-400 text-sm">(Opcional)</span>
              </div>
              <div className="flex gap-2">
                {[
                  { label: 'E-mail', value: 'email' },
                  { label: 'Telefone', value: 'phone' },
                  { label: 'WhatsApp', value: 'whatsapp' }
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handlePreferenceToggle(value)}
                    className={`px-4 py-2 rounded-full border transition-colors
                      ${formData.contactPreference.includes(value)
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-gray-200 hover:border-orange-500'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <select
              className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none appearance-none bg-white"
              value={formData.businessSegment}
              onChange={e => setFormData(prev => ({ ...prev, businessSegment: e.target.value }))}
            >
              <option value="">Segmento do seu negócio</option>
              <option value="retail">Varejo</option>
              <option value="services">Serviços</option>
              <option value="food">Alimentação</option>
            </select>

            <div className="relative">
              <textarea
                placeholder="Explique sua necessidade"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none resize-none h-28"
                value={formData.needs}
                onChange={e => {
                  const text = e.target.value;
                  if (text.length <= 100) {
                    setFormData(prev => ({ ...prev, needs: text }));
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
                onChange={e => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span>Concordo em receber informações</span>
            </label>

            <button
              type="submit"
              className="w-full bg-black text-white rounded-full py-4 font-medium hover:bg-opacity-90 transition-colors"
            >
              Enviar mensagem
            </button>
          </form>
        </div>

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
          <div className="relative flex justify-end">
            <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-orange-500" />
            <img
              src={img}
              alt="Pessoa sorrindo"
              className="relative z-10 w-full max-w-[300px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;