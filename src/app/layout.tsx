import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import CartToast from "@/components/CartToast";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Craftick — Handcrafted in Kashmir",
  description:
    "Authentic Kashmiri handcrafted luxury — pashmina shawls, stoles, sarees and more. Each piece is a testament to centuries of artisanal skill.",
  keywords: [
    "Pashmina shawls",
    "Kashmiri handicrafts",
    "Tilla embroidery",
    "Sozni work",
    "Kashmir shawls",
    "handcrafted",
    "Craftick",
  ],
  openGraph: {
    title: "Craftick — Handcrafted in Kashmir",
    description:
      "Authentic Kashmiri handcrafted luxury — pashmina shawls, stoles, sarees and more.",
    siteName: "Craftick",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="antialiased">
        <CartProvider>
          {children}
          <CartToast />
          <WhatsAppFAB />
        </CartProvider>
      </body>
    </html>
  );
}
