import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1D4ED8",
};

export const metadata: Metadata = {
  title: {
    default: "Humania TalentMap - Platform Pemetaan Talenta",
    template: "%s | Humania TalentMap",
  },
  description: "Platform pemetaan talenta untuk rekrutmen dan pengembangan tim. Assessment berbasis AI dengan analisis Gemini untuk evaluasi kandidat secara komprehensif.",
  keywords: ["assessment", "rekrutmen", "psikotes", "talent mapping", "HR technology", "evaluasi kandidat"],
  authors: [{ name: "Humania" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Humania TalentMap",
    title: "Humania TalentMap - Platform Pemetaan Talenta",
    description: "Platform pemetaan talenta untuk rekrutmen dan pengembangan tim. Assessment berbasis AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Humania TalentMap - Platform Pemetaan Talenta",
    description: "Platform pemetaan talenta untuk rekrutmen dan pengembangan tim.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
