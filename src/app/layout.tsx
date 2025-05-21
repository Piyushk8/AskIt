import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AskIT",
  description: "chat with Docs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm max-h-[4rem]">
          <h1 className="text-2xl font-bold ">
            <Link href="/" className="flex gap-2 items-center justify-center">AskIT <LinkIcon/></Link>
          </h1>
          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}
            <Link href="/upload">
              <Button>Open Chat</Button>
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
