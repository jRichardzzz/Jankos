import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Jankos.cc | Boostez votre création de contenu avec l'IA",
  description:
    "Jankos.cc - La plateforme tout-en-un pour créateurs YouTube. Générez des miniatures, trouvez des idées virales et optimisez votre SEO avec nos agents IA.",
  keywords: ["YouTube", "créateur de contenu", "IA", "miniatures", "SEO", "viral", "Jankos"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
