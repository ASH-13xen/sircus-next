import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import Navbar from "@/components/other/Navbar";
import BackgroundGrid from "@/components/ui/BackgroundGrid";

// Using Geist is perfect for this theme—it's clean and technical.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SircuS | Elite Tech Training",
  description:
    "Master the future of technology with curated paths in DSA, Web Dev, and AI.",
  // 2. REMOVE themeColor from here
};

// 3. ADD this new export
export const viewport: Viewport = {
  themeColor: "#02040a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-[#02040a] 
          text-slate-200 
          min-h-screen 
          selection:bg-blue-500/30 
          selection:text-blue-200
        `}
      >
        <ConvexClerkProvider>
          {/* Navbar is placed here to be persistent across all pages. 
            Ensure Navbar itself uses the transparent/glassmorphism styles 
            we established (e.g., bg-[#02040a]/80 backdrop-blur-md).
          */}
          <Navbar />

          {/* This likely contains the fixed position grid pattern.
            Make sure it has 'pointer-events-none' so it doesn't block clicks.
          */}
          <BackgroundGrid />

          <main className="relative z-10">{children}</main>
        </ConvexClerkProvider>
      </body>
    </html>
  );
}
