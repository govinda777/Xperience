import React from 'react';

const FooterCredits = () => {
  return (
    <div className="bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-sm text-white/80 space-y-2">
          <p>© 2024 Xperience Consultoria Empresarial – Todos os direitos reservados.</p>
          <p>
            Design por{' '}
            <a href="#" className="hover:text-[#E85D04] transition-colors">
              Samara W. Santos
            </a>
            {' '}e desenvolvido por Govinda System's DAO
          </p>
          <p>
            Ícones fornecidos por{' '}
            <a href="https://scribby.com" className="hover:text-[#E85D04] transition-colors">
              Scribby
            </a>
            {' '}via{' '}
            <a href="https://icons8.com" className="hover:text-[#E85D04] transition-colors">
              Icons8
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterCredits;