import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PrepForge — Personalized Developer Interview Preparation Platform",
    template: "%s | PrepForge"
  },
  description:
    "Master DSA patterns, full-stack development, core computer science, and technical interview questions with a personalized preparation plan and interactive calendar.",
  keywords: [
    "DSA Patterns",
    "LeetCode preparation",
    "Technical Interview",
    "System Design",
    "Operating Systems",
    "DBMS",
    "Preparation Calendar",
    "Study Planner"
  ],
  authors: [{ name: "PrepForge" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prepforge.dev",
    siteName: "PrepForge",
    title: "PrepForge — Personalized Developer Interview Preparation Platform",
    description: "Forge your skills. Crack your dream role."
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-orange-500/30 selection:text-orange-200">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
