import type { Metadata, Viewport } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: { default: "Japan-app 🇯🇵", template: "%s 🇯🇵" },
  description: "Min Japan-rejseplanlægger — seværdigheder, restauranter og mere.",
  manifest: "/manifest.json",
  icons: {
    icon: "/torii.png",
    apple: "/torii.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#BC002D",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSerifJP.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-paper text-ink antialiased">
        <Header />
        <main className="flex-1 pb-20">{children}</main>
        {modal}
        <BottomNav />
      </body>
    </html>
  );
}
