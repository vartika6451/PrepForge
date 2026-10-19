import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    default: "PrepForge — Developer Learning & Technical Interview Preparation",
    template: "%s | PrepForge"
  },
  description: "Master DSA patterns, learn modern developer technologies, prepare for software engineering interviews, and build portfolio-worthy projects.",
  keywords: ["DSA Patterns", "LeetCode preparation", "Software Engineer Interview", "Full Stack Roadmap", "System Design", "Node.js", "React", "TypeScript"],
  authors: [{ name: "PrepForge" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prepforge.dev",
    siteName: "PrepForge",
    title: "PrepForge — Developer Learning & Technical Interview Preparation",
    description: "Master DSA patterns, prepare for developer interviews, and build portfolio projects."
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#AAA7A3] text-[#272624] selection:bg-[#A34823]/30 selection:text-[#272624]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
