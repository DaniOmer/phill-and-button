import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gem, Scissors, Sparkles, Leaf } from "lucide-react";

import images from "@/constants/images";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Phill & Button — l'histoire d'une marque de vêtements haut de gamme, où le minimalisme rencontre le savoir-faire et des matières choisies avec exigence.",
};

const values = [
  {
    icon: Scissors,
    title: "Savoir-faire",
    text: "Chaque pièce est pensée dans le détail : coupes précises, finitions soignées, assemblages durables. Le vêtement se vit autant qu'il se porte.",
  },
  {
    icon: Leaf,
    title: "Matières nobles",
    text: "Nous sélectionnons des tissus haut de gamme pour leur toucher, leur tenue et leur longévité — parce que la qualité se ressent dès la première fois.",
  },
  {
    icon: Sparkles,
    title: "Minimalisme",
    text: "Des lignes épurées, des couleurs justes, une élégance qui traverse les saisons. Moins, mais mieux.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 xl:px-0 py-12">
      {/* Intro */}
      <section className="max-w-3xl">
        <div className="flex gap-2 items-center text-sm font-medium mb-4">
          <Gem size={16} />
          <span>À propos</span>
        </div>
        <h1 className="text-3xl sm:text-5xl uppercase leading-tight mb-6">
          Imaginé avec passion
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Phill &amp; Button est née d'une conviction simple : un vêtement
          d'exception ne crie pas, il se remarque. Inspirées par le minimalisme
          moderne, nos pièces allient confort et élégance, pour habiller celles
          et ceux qui font de chaque choix un parti pris.
        </p>
      </section>

      {/* Image + récit */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mt-16">
        <div className="relative w-full h-80 md:h-96">
          <Image
            src={images.Phill}
            alt="L'atelier Phill & Button"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl md:text-4xl uppercase font-medium">
            Le style parfait <br /> commence par un détail
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Nous croyons que le vrai luxe est discret : il tient à la justesse
            d'une coupe, à la douceur d'une matière, à la manière dont un
            vêtement accompagne le mouvement. Chaque collection Phill &amp;
            Button est conçue comme une garde-robe intemporelle — des pièces que
            l'on garde, que l'on réassocie, et qui traversent le temps sans se
            démoder.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Basés en Côte d'Ivoire et présents à l'international, nous
            cultivons une relation directe et humaine avec notre communauté :
            chaque commande se conclut simplement, par une conversation.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mt-20">
        <h2 className="text-2xl uppercase font-medium mb-10 text-center">
          Ce qui nous guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col gap-3 border-t pt-6"
            >
              <value.icon size={24} className="text-primary" />
              <h3 className="text-lg font-medium uppercase">{value.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 text-center">
        <h2 className="text-2xl sm:text-3xl uppercase mb-6">
          Découvrez la collection
        </h2>
        <Button
          asChild
          size="lg"
          className="rounded-full px-8 border-black bg-black text-white hover:bg-transparent hover:text-black transition-all"
          variant="outline"
        >
          <Link href="/store">Explorer la boutique</Link>
        </Button>
      </section>
    </div>
  );
}
