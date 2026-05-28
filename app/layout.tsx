import type { Metadata } from "next";
import { JetBrains_Mono, Lato, Noto_Sans_Devanagari, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ["400", "700", "900"]
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "BollyGit - Bollywood Git Log Drama Generator",
  description: "Every commit message becomes a scene from a Bollywood film.",
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "BollyGit",
    description: "Aapka code. Humara drama.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lato.variable} ${devanagari.variable} ${jetbrains.variable} film-grain font-body antialiased`}
      >
        <header className="fixed left-0 right-0 top-0 z-40 border-b border-gold/15 bg-bg/75 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-display text-xl font-black tracking-[0.16em] text-gold">
              BOLLYGIT
            </Link>
            <Link href="/hall-of-fame" className="text-sm font-bold text-cream/80 transition hover:text-gold">
              Hall of Fame
            </Link>
          </nav>
        </header>
        {children}
        <footer className="mt-8 py-8 text-center text-sm text-cream/50">
          Maintained and Developed by Krish Shah
        </footer>
      </body>
    </html>
  );
}
