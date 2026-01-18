"use client";

import * as React from "react";
import Image from "next/image";
import { Gem } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import images from "@/constants/images";

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="relative w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-[400px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="h-full">
              <Card className="border-0">
                <CardContent className="p-0">
                  <Image
                    src={images.Banner}
                    alt="Lookbook"
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  );
}

const LookBook = () => {
  return (
    <section className="mt-20">
      <div className="flex gap-2 items-center mb-4">
        <Gem size={16} />
        <span>Lookbook</span>
      </div>
      <h2 className="font-medium text-2xl uppercase mb-10">Le LookBook</h2>
      <div>
        <CarouselPlugin />
      </div>
    </section>
  );
};
export default LookBook;
