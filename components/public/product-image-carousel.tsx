"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductImageCarouselProps {
  images: string[];
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  imageClassName?: string;
}

export default function ProductImageCarousel({
  images,
  autoPlay = false,
  showControls = true,
  className,
  imageClassName,
}: ProductImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: images.length > 1,
      align: "start",
    },
    autoPlay ? [Autoplay({ delay: 4000, stopOnInteraction: false })] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative aspect-[3/4] bg-gray-100 rounded-lg",
          className
        )}
      >
        <div className="flex items-center justify-center h-full text-gray-400">
          Aucune image
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100",
          className
        )}
      >
        <Image
          src={images[0]}
          alt="Product"
          fill
          className={cn("object-cover", imageClassName)}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative group", className)}>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((url, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative aspect-[3/4] bg-gray-100"
            >
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                className={cn("object-cover", imageClassName)}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Flèches de navigation */}
      {showControls && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity",
              !canScrollPrev && "hidden"
            )}
            onClick={scrollPrev}
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity",
              !canScrollNext && "hidden"
            )}
            onClick={scrollNext}
            aria-label="Image suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Indicateurs de points */}
      {showControls && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === selectedIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
