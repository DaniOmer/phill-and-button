import type { Metadata } from "next";
import { Roboto, Inter, Lato } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: "400",
});

const amsterdamThree = localFont({
  src: [
    {
      path: "./fonts/Amsterdam.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-amsterdam",
});

export const metadata: Metadata = {
  title: "Phill & Button",
  description: "Marque de vêtement haut de gamme.",
};

import { TRPCProvider } from "@/lib/trpc/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${amsterdamThree.variable} ${roboto.variable} ${inter.variable} ${lato.variable} antialiased`}
      >
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
