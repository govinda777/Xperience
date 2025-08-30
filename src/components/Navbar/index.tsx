import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import AuthButton from "../AuthButton";

const logo = new URL("/public/logo.svg", import.meta.url).href;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth0(); // Obtém status de login e informações do usuário

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Soluções", path: "/solutions" },
    { name: "Quem somos", path: "/about" },
    { name: "Contato", path: "/contact" },
    { name: "Comunidade", path: "/community" },
    { name: "Blog", path: "/blog" },
    { name: "Planos", path: "/plans" },
    { name: "IA do Empreendedor", path: "https://ai-entrepreneur-connect.replit.app", external: true },
  ];

  return (
    <header
      className={`w-full px-4 md:px-6 py-6 bg-white transition-all duration-300 ${
        isScrolled
          ? `fixed top-0 left-0 w-full z-50  ${isOpen ? "bg-white" : "bg-white/60"}`
          : "relative"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Xperience" className="w-[100px] h-auto" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            item.external ? (
              <a
                key={item.name}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="relative text-lg text-gray-900 hover:text-gray-900 whitespace-nowrap transition-colors duration-300 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 w-0 group-hover:w-full"></span>
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-lg text-gray-900 hover:text-gray-900 whitespace-nowrap transition-colors duration-300 group ${
                  location.pathname === item.path ? "font-medium" : ""
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${
                    location.pathname === item.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            )
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <User 
                className="h-8 w-8 text-gray-700 cursor-pointer" 
                onClick={() => navigate('/dashboard')}
              />
              
              <AuthButton />
            </div>
          ) : (
            <AuthButton />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden transition-transform duration-300 hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-[#FED7AA] z-50 mt-2">
          <div className="flex flex-col p-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                item.external ? (
                  <a
                    key={item.name}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative text-lg text-gray-900 hover:text-gray-900 transition-colors duration-300 group w-fit"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 w-0 group-hover:w-full"></span>
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative text-lg text-gray-900 hover:text-gray-900 transition-colors duration-300 group w-fit ${
                      location.pathname === item.path ? "font-medium" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${
                        location.pathname === item.path
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                )
              ))}
            </nav>

            {/* Mobile Authentication */}
            <div className="flex flex-col space-y-4 pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col items-center">
                  <User 
                    className="h-6 w-6 text-gray-700 cursor-pointer" 
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                  />
                  <p className="text-lg">{user?.name}</p>
                  <AuthButton />
                </div>
              ) : (
                <AuthButton />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
