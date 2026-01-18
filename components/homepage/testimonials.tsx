import { Gem, Star } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface ReviewStarsProps {
  rating: number;
  readonly?: boolean;
}

const ReviewStars = ({ rating, readonly = true }: ReviewStarsProps) => {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Note: ${rating} sur 5 étoiles`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalf = index < rating && index >= Math.floor(rating);

        return (
          <span key={index} className="text-yellow-500">
            {isFilled ? (
              <Star className="w-4 h-4 fill-current" />
            ) : isHalf ? (
              <Star className="w-4 h-4 fill-current opacity-50" />
            ) : (
              <Star className="w-4 h-4" />
            )}
          </span>
        );
      })}
      <span className="sr-only">{rating} sur 5 étoiles</span>
    </div>
  );
};

const Testimonials = () => {
  function TestimonialCard() {
    return (
      <Card className="rounded-none p-4 md:p-6 border-none shadow-md">
        <CardTitle className="mb-3">Qualité incroyable</CardTitle>
        <CardContent className="p-0">
          <div className="mb-4">
            <ReviewStars rating={4.5} />
          </div>
          <p className="mb-5">
            J'ai récemment acheté une jacket noir Phill & Button et la qualité
            est juste incroyable. Le détail des finitions est impressionnant. Si
            vous rechercher une pièce pour sublimer vos looks, je vous
            recommande la jacket FO2, un vrai coup de coeur.
          </p>
          <div className="flex items-center gap-4 border-t pt-3">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="User avatar"
                className="rounded-full w-12 h-12"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <span className="block font-medium">S. Diabate</span>
              <span className="block text-gray-500">
                Chargé de communication RTL
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  function CarouselSpacing() {
    return (
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <TestimonialCard />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }

  return (
    <section className="mt-20">
      <div className="flex gap-2 items-center mb-4">
        <Gem size={16} />
        <span>Avis clients</span>
      </div>
      <h2 className="font-medium text-2xl uppercase mb-10">Les avis clients</h2>
      <div>
        <CarouselSpacing />
      </div>
    </section>
  );
};
export default Testimonials;
