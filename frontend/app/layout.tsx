import type { Metadata } from "next";
import { AuthProvider } from "../context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Geist } from "next/font/google";
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
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}