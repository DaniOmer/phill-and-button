import type { Metadata } from "next";

import { PageHeading } from "@/components/public/page-heading";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Phill & Button collecte, utilise et protège vos données personnelles.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 xl:px-0 py-12">
      <PageHeading
        eyebrow="Confidentialité"
        title="Politique de confidentialité"
        intro="Nous attachons une grande importance à la protection de vos données personnelles. Voici comment elles sont traitées."
      />

      <section className="mt-12 max-w-3xl space-y-8 text-gray-600 leading-relaxed">
        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Données que nous collectons
          </h2>
          <p>
            Nous collectons uniquement les informations nécessaires au
            traitement de vos commandes et à notre relation avec vous : nom,
            coordonnées de contact (WhatsApp, email), informations de livraison
            et détails de commande. Certaines données techniques peuvent être
            enregistrées via des cookies essentiels au fonctionnement du site.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Utilisation de vos données
          </h2>
          <p>
            Vos données servent à traiter et livrer vos commandes, à répondre à
            vos demandes et à améliorer notre service. Nous ne vendons ni ne
            louons vos informations personnelles à des tiers.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Partage
          </h2>
          <p>
            Vos données ne sont partagées qu'avec les prestataires strictement
            nécessaires à l'exécution de votre commande (par exemple la
            livraison ou le paiement), et uniquement dans cette mesure.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Vos droits
          </h2>
          <p>
            Vous pouvez à tout moment demander l'accès, la rectification ou la
            suppression de vos données personnelles en nous écrivant à
            contact@phillandbutton.com.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          Dernière mise à jour : septembre 2026.
        </p>
      </section>
    </div>
  );
}
