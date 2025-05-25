import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/[lang]/Providers";
import { getDictionary, SupportedLanguages } from "@/app/dictionaries";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner"
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Betterlytics – Simple, Privacy-Friendly Website Analytics",
  description: "Betterlytics helps you track your website traffic with clean, real-time insights. No cookies, no bloat – just better analytics built for speed, privacy, and clarity.",
  icons: {
    icon: [
      { url: "/images/favicon-dark.svg", media: "(prefers-color-scheme: light)", type: "image/svg+xml" },
      { url: "/images/favicon-light.svg", media: "(prefers-color-scheme: dark)", type: "image/svg+xml" },
    ],
  },
};

type RootLayoutParams = {
  children: ReactNode,
  params: Promise<{lang: SupportedLanguages}>
}

export default async function RootLayout({
  children,
  params
}: RootLayoutParams) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers dictionary={dict}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
