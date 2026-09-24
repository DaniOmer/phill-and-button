import type { Metadata } from "next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeading } from "@/components/public/page-heading";

export const metadata: Metadata = {
  title: "Guide des tailles",
  description:
    "Trouvez votre taille idéale chez Phill & Button grâce à notre guide des tailles indicatif.",
};

const sizes = [
  { size: "S", chest: "88 – 94", waist: "74 – 80" },
  { size: "M", chest: "96 – 102", waist: "82 – 88" },
  { size: "L", chest: "104 – 110", waist: "90 – 96" },
  { size: "XL", chest: "112 – 118", waist: "98 – 104" },
  { size: "XXL", chest: "120 – 126", waist: "106 – 112" },
];

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 xl:px-0 py-12">
      <PageHeading
        eyebrow="Guide des tailles"
        title="Trouvez votre taille"
        intro="Mesurez-vous et comparez avec le tableau ci-dessous pour choisir la coupe qui vous ira le mieux."
      />

      <section className="mt-12 max-w-3xl">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Taille</TableHead>
                <TableHead>Poitrine (cm)</TableHead>
                <TableHead>Tour de taille (cm)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizes.map((row) => (
                <TableRow key={row.size}>
                  <TableCell className="font-medium">{row.size}</TableCell>
                  <TableCell>{row.chest}</TableCell>
                  <TableCell>{row.waist}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Mesures indicatives, susceptibles de varier légèrement selon les
          modèles et les coupes.
        </p>

        <div className="mt-8 space-y-4 text-gray-600 leading-relaxed">
          <h2 className="text-lg font-medium uppercase text-black">
            Un doute sur votre taille ?
          </h2>
          <p>
            Chaque pièce a sa propre coupe. Si vous hésitez entre deux tailles,
            écrivez-nous sur WhatsApp : nous vous conseillons en fonction du
            modèle et de la coupe souhaitée.
          </p>
        </div>
      </section>
    </div>
  );
}
