import type { Metadata } from "next";

import { PageHeading } from "@/components/public/page-heading";

export const metadata: Metadata = {
  title: "Livraison",
  description:
    "Zones, délais et suivi de livraison Phill & Button : Côte d'Ivoire et international.",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 xl:px-0 py-12">
      <PageHeading
        eyebrow="Livraison"
        title="Expédition & livraison"
        intro="Nous préparons chaque commande avec soin pour qu'elle vous parvienne dans les meilleures conditions."
      />

      <section className="mt-12 max-w-3xl space-y-8 text-gray-600 leading-relaxed">
        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Zones de livraison
          </h2>
          <p>
            Nous livrons partout en <strong>Côte d'Ivoire</strong> ainsi qu'à
            l'<strong>international</strong> sur demande. Où que vous soyez,
            nous trouvons la solution la plus adaptée avec vous.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Délais & frais
          </h2>
          <p>
            Les frais et délais de livraison dépendent de votre localisation et
            du mode d'expédition choisi. Ils vous sont communiqués et confirmés
            lors de la validation de votre commande sur WhatsApp, avant tout
            règlement — sans mauvaise surprise.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Suivi de commande
          </h2>
          <p>
            Une fois votre commande expédiée, nous vous tenons informé
            directement sur WhatsApp jusqu'à la réception de votre colis.
          </p>
        </div>
      </section>
    </div>
  );
}
