import React from "react";
import Header from "./_components/Header";
import NavFooter from "./_components/NavFooter";

function DashboardLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="mb-20">{children}</div>
      <div className="md:hidden w-full m-auto fixed bottom-0">
        <NavFooter />
      </div>
    </div>
  );
}

export default DashboardLayout;
