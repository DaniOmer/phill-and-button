"use client";
import Link from "next/link";
import { useState } from "react";

import { ShoppingBag, User, Menu, X } from "lucide-react";

import { Button } from "../ui/button";
import { useCart } from "@/lib/cart/cart-context";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { totalItems, openCart } = useCart();

  return (
    <header>
      <nav
        className={`w-full h-[70px] fixed flex items-center z-20 backdrop-blur-md`}
      >
        <div className="relative container mx-auto px-4 xl:px-0 flex justify-between items-center">
          <Link href={`/`} className="text-sm font-amsterdam font-semibold">
            Phill & Button
          </Link>
          {/* <SearchBar
            className="hidden lg:flex w-72 !absolute -translate-x-1/2 left-1/2"
            handleSubmit={handleSearchSubmit}
          /> */}
          <div className="flex items-center md:gap-14">
            <ul className="hidden md:flex gap-6">
              <li className="hover:underline">
                <Link href={`/store`}>Boutique</Link>
              </li>
              <li className="hover:underline">
                <Link href={`/faq`}>FAQs</Link>
              </li>
            </ul>
            <div className="flex gap-4 items-center">
              <Button
                variant="outline"
                onClick={openCart}
                aria-label="Ouvrir le panier"
                className="relative border w-10 h-10 rounded-full"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
              <Link
                href={`/login`}
                className="flex justify-center items-center border w-10 h-10 rounded-full"
              >
                <User size={20} />
              </Link>

              {/* Mobile menu button */}
              <div className="md:hidden">
                {isMenuOpen ? (
                  <Button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    variant="outline"
                  >
                    <X size={20} />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    variant="outline"
                  >
                    <Menu size={20} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu items */}
        <div
          className={`fixed left-0 right-0 top-[4.5rem] z-40 transition-all duration-300 md:hidden ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <div className="container mx-auto border-t border-b py-8 px-4 flex flex-col justify-center items-center gap-8 bg-background">
            <ul className="flex flex-col justify-center items-center gap-8">
              <li className="hover:underline">
                <Link href="/store" onClick={() => setIsMenuOpen(false)}>
                  Boutique
                </Link>
              </li>
              <li className="hover:underline">
                <Link href="/faq" onClick={() => setIsMenuOpen(false)}>
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;
