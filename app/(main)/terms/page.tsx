import type { Metadata } from "next";
import Link from "next/link";

import { PageHeading } from "@/components/public/page-heading";

export const metadata: Metadata = {
  title: "Conditions générales",
  description:
    "Conditions générales de vente et d'utilisation de la boutique Phill & Button.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 xl:px-0 py-12">
      <PageHeading
        eyebrow="Conditions"
        title="Conditions générales"
        intro="Les présentes conditions encadrent l'utilisation du site et les commandes passées auprès de Phill & Button."
      />

      <section className="mt-12 max-w-3xl space-y-8 text-gray-600 leading-relaxed">
        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Produits & prix
          </h2>
          <p>
            Nos produits sont présentés avec le plus grand soin. Les prix sont
            indiqués en FCFA. Nous nous réservons le droit de modifier nos prix
            à tout moment ; les articles sont facturés sur la base du tarif en
            vigueur au moment de la commande.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Commandes & paiement
          </h2>
          <p>
            Les commandes se finalisent via WhatsApp. Le paiement s'effectue par
            mobile money (Wave, Orange Money) ou par virement bancaire. Une
            commande est considérée comme confirmée après validation et
            règlement.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Livraison & échanges
          </h2>
          <p>
            Les modalités de livraison sont détaillées sur la page{" "}
            <Link href="/shipping" className="underline hover:text-black">
              Livraison
            </Link>
            . Les conditions d'échange figurent sur la page{" "}
            <Link href="/returns" className="underline hover:text-black">
              Retours &amp; échanges
            </Link>
            .
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Propriété intellectuelle
          </h2>
          <p>
            L'ensemble des contenus du site (textes, visuels, logo) est la
            propriété de Phill &amp; Button et ne peut être reproduit sans
            autorisation.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Contact
          </h2>
          <p>
            Pour toute question relative à ces conditions, écrivez-nous à
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
