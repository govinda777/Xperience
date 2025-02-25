import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

const logo = new URL("/public/logo.svg", import.meta.url).href;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
  ];

  return (
    <header
      className={`w-full px-4 md:px-6 py-6 bg-white transition-all duration-300 ${
        isScrolled
          ? "fixed top-0 left-0 w-full shadow-md z-50 bg-white/60"
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
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="flex items-center gap-2 px-6 py-2 rounded-2xl border-2 border-black bg-white transition-all duration-300 hover:bg-white/10 hover:shadow-md"
          >
            <User className="h-8 w-8" />
            <p className="font-bold text-lg">Login</p>
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 bg-black text-white rounded-2xl transition-all duration-300 hover:bg-gray-900 hover:shadow-md hover:-translate-y-0.5"
          >
            <p className="font-bold text-lg">Primeiro acesso</p>
          </Link>
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
              ))}
            </nav>
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-black transition-all duration-300 hover:bg-white/10 hover:shadow-md"
              >
                <User className="h-5 w-5" />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-full transition-all duration-300 hover:bg-gray-900 hover:shadow-md hover:-translate-y-0.5"
              >
                Primeiro acesso
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
