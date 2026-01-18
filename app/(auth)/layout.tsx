/**
 * Layout pour les pages d'authentification
 * Pas de header/footer, juste le contenu centré
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
