import type { Metadata } from "next";
import Link from "next/link";
import { Gem, Plus, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Commande, paiement, livraison, échanges, tailles : toutes les réponses aux questions fréquentes sur Phill & Button.",
};

const faqs = [
  {
    q: "Comment passer une commande ?",
    a: "Parcourez la boutique, ajoutez vos articles au panier, puis cliquez sur « Commander via WhatsApp ». Un message pré-rempli avec votre sélection s'ouvre : il ne vous reste qu'à l'envoyer. Vous pouvez aussi commander une pièce directement depuis sa fiche produit.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Nous acceptons le mobile money (Wave, Orange Money) et le virement bancaire. Les modalités vous sont précisées lors de la confirmation de votre commande sur WhatsApp.",
  },
  {
    q: "Livrez-vous partout ? Quels sont les délais ?",
    a: "Nous livrons en Côte d'Ivoire et à l'international sur demande. Les frais et les délais de livraison dépendent de votre localisation et vous sont communiqués lors de la confirmation de commande.",
  },
  {
    q: "Puis-je échanger un article ?",
    a: "Oui. Vous disposez de 7 jours après réception pour demander un échange, à condition que l'article soit intact, non porté et muni de ses étiquettes d'origine. Contactez-nous sur WhatsApp pour organiser l'échange.",
  },
  {
    q: "Comment choisir ma taille ?",
    a: "Chaque fiche produit précise les informations utiles. En cas de doute, écrivez-nous sur WhatsApp : nous vous conseillons avec plaisir pour trouver la coupe idéale.",
  },
  {
    q: "Comment entretenir mes vêtements ?",
    a: "Pour préserver la qualité des matières, privilégiez un lavage à basse température, sur l'envers, et évitez le sèche-linge. Un entretien soigné prolonge la vie de vos pièces.",
  },
];

export default function FaqPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="container mx-auto px-4 xl:px-0 py-12">
      {/* Intro */}
      <section className="max-w-3xl">
        <div className="flex gap-2 items-center text-sm font-medium mb-4">
          <Gem size={16} />
          <span>FAQ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl uppercase leading-tight mb-6">
          Questions fréquentes
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Tout ce qu'il faut savoir pour commander, payer et recevoir vos pièces
          Phill &amp; Button en toute sérénité.
        </p>
      </section>

      {/* Accordéon */}
      <section className="mt-12 max-w-3xl divide-y border-t border-b">
        {faqs.map((faq) => (
          <details key={faq.q} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between gap-4 list-none font-medium">
              <span>{faq.q}</span>
              <Plus className="h-5 w-5 shrink-0 text-gray-500 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </section>

      {/* Contact */}
      <section className="mt-16 max-w-3xl rounded-lg bg-gray-50 p-8 text-center">
        <h2 className="text-xl sm:text-2xl uppercase mb-3">
          Une autre question ?
        </h2>
        <p className="text-gray-600 mb-6">
          Notre équipe vous répond directement sur WhatsApp.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5 mr-2" />
            Nous contacter
          </a>
        </Button>
      </section>
    </div>
  );
}
