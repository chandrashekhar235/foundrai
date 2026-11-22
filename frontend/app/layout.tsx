
import type { Metadata } from "next";
import { AuthProvider } from "../context/AuthContext";
import Providers from "@/components/Providers";
import { Geist } from "next/font/google";
import IntroAnimation from "../components/IntroAnimation";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoundrAI",
  description: "Your AI Co-Founder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-[#0A0A0A] text-white`}>
        <Providers>
          <AuthProvider>
            <IntroAnimation />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
