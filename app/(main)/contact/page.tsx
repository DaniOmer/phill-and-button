import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/public/page-heading";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Phill & Button : commandes, conseils et service client, directement sur WhatsApp ou par email.",
};

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="container mx-auto px-4 xl:px-0 py-12">
      <PageHeading
        eyebrow="Contact"
        title="Parlons-en"
        intro="Une question sur une pièce, une commande ou une taille ? Notre équipe vous répond avec plaisir — le plus simple reste WhatsApp."
      />

      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
        <div className="flex flex-col gap-3 border-t pt-6">
          <MessageCircle size={24} className="text-primary" />
          <h2 className="text-lg font-medium uppercase">WhatsApp</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Le moyen le plus rapide pour commander et échanger avec nous.
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700 w-fit">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              Écrire sur WhatsApp
            </a>
          </Button>
        </div>

        <div className="flex flex-col gap-3 border-t pt-6">
          <Mail size={24} className="text-primary" />
          <h2 className="text-lg font-medium uppercase">Email</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Pour toute demande écrite ou professionnelle.
          </p>
          <a
            href="mailto:contact@phillandbutton.com"
            className="text-sm hover:underline w-fit"
          >
            contact@phillandbutton.com
          </a>
        </div>

        <div className="flex flex-col gap-3 border-t pt-6">
          <MapPin size={24} className="text-primary" />
          <h2 className="text-lg font-medium uppercase">Où nous sommes</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Basés en Côte d'Ivoire, nous livrons localement et à
            l'international.
          </p>
        </div>
      </section>
    </div>
  );
}
