import type { Metadata } from "next";

import { PageHeading } from "@/components/public/page-heading";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description:
    "Quels cookies et stockages Phill & Button utilise, et comment les gérer.",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 xl:px-0 py-12">
      <PageHeading
        eyebrow="Cookies"
        title="Politique de cookies"
        intro="Nous utilisons un minimum de traceurs, uniquement pour faire fonctionner le site correctement."
      />

      <section className="mt-12 max-w-3xl space-y-8 text-gray-600 leading-relaxed">
        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Qu'est-ce qu'un cookie ?
          </h2>
          <p>
            Un cookie est un petit fichier déposé sur votre appareil lors de
            votre visite. Il permet notamment de mémoriser des informations
            entre les pages ou les sessions.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Ce que nous utilisons
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Cookies essentiels</strong> : nécessaires à la sécurité et
              à la gestion de session (par exemple la connexion à l'espace
              administrateur).
            </li>
            <li>
              <strong>Stockage local</strong> : votre panier est conservé dans
              votre navigateur afin de le retrouver lors de votre prochaine
              visite.
            </li>
          </ul>
          <p className="mt-3">
            Nous n'utilisons pas de cookies publicitaires ni de traceurs de
            profilage à des fins marketing.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium uppercase text-black mb-2">
            Gérer les cookies
          </h2>
          <p>
            Vous pouvez à tout moment supprimer ou bloquer les cookies via les
            paramètres de votre navigateur. Le blocage des cookies essentiels
            peut toutefois affecter le bon fonctionnement du site.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          Dernière mise à jour : septembre 2026.
        </p>
      </section>
    </div>
  );
}
