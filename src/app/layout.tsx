import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-terminal",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ICE RADAR",
  description: "Anonymous community reporting and tracking system for ICE activity. Real-time alerts protecting communities.",
  icons: {
    icon: "/logo-icon.svg",
  },
  openGraph: {
    title: "ICE RADAR",
    description: "Anonymous community reporting and tracking system for ICE activity. Real-time alerts protecting communities.",
    type: "website",
    siteName: "ICE Radar",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "ICE RADAR - Community Alert System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ICE RADAR",
    description: "Anonymous community reporting and tracking system for ICE activity. Real-time alerts protecting communities.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${pressStart2P.variable} ${vt323.variable} font-mono bg-background text-foreground scanlines crt-vignette crt-flicker`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
