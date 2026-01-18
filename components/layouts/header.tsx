"use client";
import Link from "next/link";
import { useState } from "react";

import { ShoppingBag, User, Menu, X } from "lucide-react";

import { Button } from "../ui/button";
import { SearchBar } from "../searchBar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleSearchSubmit = (searchTerm: string) => {
    // TODO : Implement the logic to get corresponding product from server
    console.log("Search term ", searchTerm);
  };

  return (
    <header>
      <nav
        className={`w-full h-[70px] fixed flex items-center z-20 backdrop-blur-md`}
      >
        <div className="relative container mx-auto px-4 xl:px-0 flex justify-between items-center">
          <Link href={`#`} className="text-sm font-amsterdam font-semibold">
            Phill & Button
          </Link>
          <SearchBar
            className="hidden lg:flex w-72 !absolute -translate-x-1/2 left-1/2"
            handleSubmit={handleSearchSubmit}
          />
          <div className="flex items-center md:gap-14">
            <ul className="hidden md:flex gap-6">
              <li className="hover:underline">
                <Link href={`#`}>Boutique</Link>
              </li>
              <li className="hover:underline">
                <Link href={`#`}>FAQs</Link>
              </li>
            </ul>
            <div className="flex gap-4 items-center">
              <Button
                variant="outline"
                className="border w-10 h-10 rounded-full"
              >
                <ShoppingBag size={20} />
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
        <div className="relative md:hidden">
          <div
            className={`fixed left-0 right-0 top-[4.5rem] transition-transform duration-300 z-40 ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="container mx-auto border-t border-b py-8 px-4 flex md:hidden flex-col justify-center items-center gap-8 bg-background">
              <ul className="flex md:hidden flex-col justify-center items-center gap-8">
                <li className="hover:underline">
                  <Link href={`#`}>Boutique</Link>
                </li>
                <li className="hover:underline">
                  <Link href={`#`}>FAQs</Link>
                </li>
              </ul>
              {/* <SearchBar className="w-full" handleSubmit={handleSearchSubmit} /> */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;
