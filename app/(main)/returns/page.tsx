import type { Metadata } from "next";

import { PageHeading } from "@/components/public/page-heading";

export const metadata: Metadata = {
  title: "Retours & échanges",
  description:
    "Politique d'échange Phill & Button : échange possible sous 7 jours pour tout article intact.",
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 xl:px-0 py-12">
      <PageHeading
        eyebrow="Retours"
        title="Retours & échanges"
        intro="Votre satisfaction compte. Si une pièce ne vous convient pas, nous facilitons l'échange."
      />

      <section className="mt-12 max-w-3xl space-y-8 text-gray-600 leading-relaxed">
        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Échange sous 7 jours
          </h2>
          <p>
            Vous disposez de <strong>7 jours</strong> après réception pour
            demander un échange. Passé ce délai, nous ne pouvons
            malheureusement plus garantir la prise en charge.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Conditions
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>L'article doit être intact et non porté.</li>
            <li>Il doit conserver ses étiquettes d'origine.</li>
            <li>
              Les articles endommagés par une mauvaise utilisation ne sont pas
              repris.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Comment procéder
          </h2>
          <p>
            Contactez-nous sur WhatsApp en précisant votre commande et l'article
            concerné. Nous organisons ensemble l'échange (taille, modèle ou
            avoir) dans les meilleurs délais.
          </p>
        </div>
      </section>
    </div>
  );
}
