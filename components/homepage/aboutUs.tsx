import Image from "next/image";
import Link from "next/link";
import { Gem } from "lucide-react";

import images from "@/constants/images";

const AboutUs = () => {
  return (
    <section className="mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <Image
          src={images.Phill}
          alt="Our story"
          className="h-80 object-cover"
        />
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 items-center text-sm font-medium">
            <Gem size={16} />
            <span>À propos</span>
          </div>
          <h2 className="text-2xl md:text-4xl uppercase font-medium">
            Imaginé avec <br /> passion
          </h2>

          <div>
            <p className="mb-8">
              Inspirées par le minimalisme moderne, nos pièces allient confort
              et élégance. Chaque vêtement est conçu avec une attention
              particulière aux détails, des matériaux haut de gamme et un style
              intemporel.
            </p>
            <Link
              href={`/about-us`}
              className="block w-fit px-8 py-3 border border-black bg-black text-white hover:bg-transparent hover:text-black transition-all ease-in delay-100"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutUs;
