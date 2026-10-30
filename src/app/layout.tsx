import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CivicPulse — AI-Powered Civic Complaint & Action Platform",
  description:
    "Production-grade civic complaint & action platform for PromptWars x ASTRA hackathon. Features Gemini 3.8 Flash understanding, explainable prioritization, cluster hotspot detection, and live citizen tracking.",
  keywords: [
    "CivicPulse",
    "Smart City",
    "Gemini AI",
    "Civic Complaints",
    "Hotspot Detection",
    "PromptWars",
    "ASTRA",
  ],
  authors: [{ name: "CivicPulse Systems Engineering" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
