import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="min-h-screen w-full bg-[#FD9526]">
        <Navbar />
        <main>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default DefaultLayout;