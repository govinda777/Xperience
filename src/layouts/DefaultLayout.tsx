import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AnalyticsProvider } from "../contexts/AnalyticsContext";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <AnalyticsProvider>
        <div className="min-h-screen w-full bg-[#FD9526]">
          <Navbar />
          <main>{children}</main>
        </div>
        <Footer />
      </AnalyticsProvider>
    </HelmetProvider>
  );
};

export default DefaultLayout;
