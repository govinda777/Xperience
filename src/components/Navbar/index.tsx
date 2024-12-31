import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    'Soluções',
    'Quem somos',
    'Contato',
    'Comunidade',
    'Blog',
    'Planos'
  ];

  return (
    <header className="w-full bg-[#FED7AA] px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src="public/logo.svg" alt="Xperience" className="h-8" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-sm text-gray-900 hover:text-gray-600 whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <a 
            href="#" 
            className="flex items-center gap-2 px-6 py-2 rounded-full border border-black hover:bg-white/10"
          >
            <User className="h-5 w-5" />
            Login
          </a>
          <a 
            href="#" 
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-900"
          >
            Primeiro acesso
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-[#FED7AA] z-50">
          <div className="flex flex-col p-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-lg text-gray-900 hover:text-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex flex-col space-y-4 pt-4">
              <a 
                href="#" 
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-black hover:bg-white/10"
              >
                <User className="h-5 w-5" />
                Login
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900"
              >
                Primeiro acesso
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;