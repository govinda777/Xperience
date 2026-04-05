import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-white">
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
