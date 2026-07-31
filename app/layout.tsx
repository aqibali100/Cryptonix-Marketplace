import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppChrome from "./components/layout/AppChrome";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cryptonix — Discover Digital Assets",
  description: "A seamless cross-chain marketplace for rare digital assets and visionary creators.",
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body
        suppressHydrationWarning
        className="relative min-h-screen overflow-x-hidden bg-[#050711] font-sans text-[#f7f8ff] before:pointer-events-none before:fixed before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_80%_10%,rgba(73,54,158,0.24),transparent_32rem)] before:content-[''] after:pointer-events-none after:fixed after:inset-0 after:-z-10 after:bg-[radial-gradient(circle_at_8%_35%,rgba(25,119,126,0.14),transparent_28rem)] after:content-[''] [&_a]:text-inherit [&_a]:no-underline [&_button]:text-inherit"
      >
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
