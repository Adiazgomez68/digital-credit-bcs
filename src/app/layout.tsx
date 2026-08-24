import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { TanstackProvider } from "@/providers/tanstack-provider";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crédito Digital BCS",
  description: "Crédito Digital BCS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full scroll-smooth scroll-pt-24 antialiased`}
    >
      <TanstackProvider>
        <body className="min-h-full flex flex-col">
          <Header>
            <MarketingNav />
          </Header>

          {children}

          <Footer />
        </body>
      </TanstackProvider>
    </html>
  );
}
