
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Providers from "../components/Providers";
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
      <body
        className={`${geist.className} bg-[#0A0A0A] text-white`}
      >
        <Providers>
          <IntroAnimation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
