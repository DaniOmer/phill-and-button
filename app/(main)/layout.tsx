import React from "react";

import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="font-roboto pt-36">{children}</main>
      <Footer />
    </>
  );
};
export default MainLayout;
