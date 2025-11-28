"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import Banner from "@/components/homepage/banner";

export default function Home() {
  return (
    <div className="container mx-auto px-4 xl:px-0 flex items-center justify-center font-sans dark:bg-black">
      <Banner />
    </div>
  );
}
