import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from 'next/image';

import "./globals.css";
import Link from "next/link";
import {MetaData} from "@/components/MetaData";
import {ReactQueryProvider} from "@/components/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contentful Tools",
  description: "A set of contentful tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
          <ReactQueryProvider>
              <header className="w-full bg-primary-dark shadow-sm flex items-center px-4 justify-between">
                  <div className="flex items-center">
                      <Link href="/">
                          <img src="/logo.png" alt="Logo" />
                      </Link>
                  </div>
                  <MetaData/>
              </header>
              {children}
          </ReactQueryProvider>
      </body>
    </html>
  );
}
