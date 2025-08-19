import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css'
import '../style/globals.css'
import { Toaster } from "sonner";

const interFont = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume Generator",
  description: "Generate tailored resumes and cover letters with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interFont.variable} antialiased bg-white`}
      >
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
