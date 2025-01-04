import React from 'react';
import { Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import FooterCredits from '../FooterCredits';

const logo = new URL('/public/logo-white.png', import.meta.url).href;

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2B2B2B] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Header with Logo and Back to Top */}
          <div className="flex justify-between items-center py-8">
            <img src={logo} alt="Xperience" className="h-12" />
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white hover:text-[#E85D04] transition-colors"
            >
              Voltar ao topo <ArrowUp className="h-4 w-4" />
            </button>
          </div>

          {/* Social Links and Newsletter */}
          <div className="flex justify-between items-start py-8">
            <div className="flex gap-6">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <div className="bg-white rounded-full p-2">
                  <Facebook className="h-6 w-6 text-[#2B2B2B]" />
                </div>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <div className="bg-white rounded-full p-2">
                  <Instagram className="h-6 w-6 text-[#2B2B2B]" />
                </div>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <div className="bg-white rounded-full p-2">
                  <Linkedin className="h-6 w-6 text-[#2B2B2B]" />
                </div>
              </a>
            </div>

            <div>
              <h3 className="text-xl mb-4">Receba promoções e novidades</h3>
              <div className="flex gap-4">
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  className="px-4 py-2 rounded-full bg-white text-black w-64"
                />
                <button className="bg-[#E85D04] text-white px-8 py-2 rounded-full hover:bg-opacity-90 transition-colors flex items-center gap-2">
                  Enviar <span>✓</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex justify-center items-center pb-8">
            <nav className="flex gap-4 items-center">
              <a href="#" className="text-white/80 hover:text-[#E85D04] transition-colors">
                Condições gerais
              </a>
              <span className="text-white/50">|</span>
              <a href="#" className="text-white/80 hover:text-[#E85D04] transition-colors">
                Política de Privacidade
              </a>
            </nav>
          </div>
        </div>
      </div>
      <FooterCredits />
    </footer>
  );
};

export default Footer;