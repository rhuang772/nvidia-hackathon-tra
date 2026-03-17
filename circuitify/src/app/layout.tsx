import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Circuitify — AI Home Energy Optimizer",
  description: "Nemotron-powered multi-agent home energy optimization system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased text-gray-100`}>{children}</body>
    </html>
  );
}
