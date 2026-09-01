import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/AppChrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ANTI-TODO — AI-Powered Task Elimination",
  description: "Prioritization through elimination. Find the work you should ignore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${mono.variable} font-body bg-black text-white min-h-screen flex flex-col antialiased`}
      >
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
