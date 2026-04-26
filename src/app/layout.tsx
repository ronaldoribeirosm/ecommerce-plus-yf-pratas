import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartDrawer } from "@/components/layout/CartDrawer";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "YF Pratas - Joias em Prata 925",
  description: "Elegância e sofisticação em joias de prata 925 com garantia vitalícia. - YF Pratas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${playfair.variable} ${poppins.variable} font-sans antialiased text-text-main bg-background`}>
        <AuthProvider>
          {children}
          <CartDrawer />
        </AuthProvider>
      </body>
    </html>
  );
}
