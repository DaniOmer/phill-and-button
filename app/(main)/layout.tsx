import React from "react";

import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import { CartProvider } from "@/lib/cart/cart-context";
import CartDrawer from "@/components/cart/cart-drawer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CartProvider>
      <Header />
      <main className="font-roboto pt-36">{children}</main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
};
export default MainLayout;
