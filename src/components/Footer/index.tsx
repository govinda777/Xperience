import React from "react";
import { ArrowUp } from "lucide-react";
import FooterCredits from "../FooterCredits";
import LogoWhite from "../../../assets/logoWhite.svg";
import Right from "../../../assets/svg/right.svg";
import Facebook from "../../../assets/svg/social/facebook.svg";
import Instagram from "../../../assets/svg/social/instagram.svg";
import Linkedin from "../../../assets/svg/social/linkedin.svg";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#2B2B2B] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Header with Logo and Back to Top */}
          <div className="flex justify-between md:flex-row flex-col-reverse items-center py-8 md:gap-0 gap-14">
            <img
              src={LogoWhite}
              alt="Xperience logo"
              className="md:w-40 w-52"
            />
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white hover:text-[#E85D04] transition-colors"
            >
              <p className="font-bold text-2xl">Voltar ao topo</p>{" "}
              <ArrowUp className="h-6 w-6 text-[#E85D04]" />
            </button>
          </div>

          {/* Social Links and Newsletter */}
          <div className="flex-col mx-auto md:mx-0 flex md:flex-row justify-between items-center md:py-7  py-10">
            <div className="flex gap-14 md:pb-0 pb-10">
              <a href="#" className="hover:opacity-80 transition-opacity gap-5">
                <div className="">
                  <img src={Facebook} alt="Facebook" className="h-12 w-12" />
                </div>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <div className="">
                  <img src={Instagram} alt="Instagram" className="h-12 w-12" />
                </div>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <div className="">
                  <img src={Linkedin} alt="Linkedin" className="h-12 w-12" />
                </div>
              </a>
            </div>

            <div>
              <h3 className="md:text-3xl text-xl mb-4 font-bold">
                Receba promoções e novidades
              </h3>
              <div className="flex gap-4 flex-col md:flex-row">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="px-4 py-4 rounded-2xl w-full bg-white text-black border-2 border-[#A3A3A3]"
                />
                <button className="md:w-auto w-full bg-[#E85D04] text-white px-8 mx-auto py-4 rounded-2xl hover:bg-opacity-90 transition-colors flex items-center  justify-center gap-2">
                  <p className="font-bold text-lg md:text-base">Enviar</p>{" "}
                  <img src={Right} alt="right" className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex justify-center items-center pb-8">
            <nav className="flex gap-4 items-center md:text-base text-sm">
              <a
                href="#"
                className="text-white/80 hover:text-[#E85D04] transition-colors"
              >
                Condições gerais
              </a>
              <span className="text-white/50">|</span>
              <a
                href="#"
                className="text-white/80 hover:text-[#E85D04] transition-colors"
              >
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
