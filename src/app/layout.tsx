import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://gohealthyacademy.com"
  ),
  title: "Go Healthy Academy — Formation Internationale en Algérie",
  description:
    "Go Healthy Academy — Application pratique de la médecine quantique et nano médecine. 4, 5 & 6 Juin 2026 — Hôtel Le Lido, Alger.",
  keywords: [
    "nano médecine",
    "médecine quantique",
    "conférence médicale",
    "Algérie",
    "Go Healthy Academy",
    "formation médicale",
  ],
  authors: [{ name: "Go Healthy Academy" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Go Healthy Academy — Formation Internationale en Algérie",
    description:
      "Application pratique de la médecine quantique et nano médecine. 4, 5 & 6 Juin 2026.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Go Healthy Academy — Formation Internationale en Algérie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Go Healthy Academy — Formation Internationale en Algérie",
    description:
      "Application pratique de la médecine quantique et nano médecine. 4, 5 & 6 Juin 2026.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
