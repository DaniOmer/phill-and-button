"use client";

import Banner from "@/components/homepage/banner";
import TrendingProducts from "@/components/homepage/trendingProducts";
import AboutUs from "@/components/homepage/aboutUs";
import LookBook from "@/components/homepage/lookBook";
import Testimonials from "@/components/homepage/testimonials";

export default function Home() {
  return (
    <div className="container mx-auto px-4 xl:px-0 flex flex-col justify-center gap-10 font-sans dark:bg-black">
      <Banner />
      <TrendingProducts />
      <AboutUs />
      <LookBook />
      <Testimonials />
    </div>
  );
}
