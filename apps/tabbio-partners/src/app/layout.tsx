import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { Toaster } from "sonner";

import { DemoProvider } from "@/components/demo-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tabbio.com",
  ),
  title: { default: "Tabbio Partners", template: "%s · Tabbio Partners" },
  description:
    "Create useful career content, refer customers to Tabbio, and track eligible recurring commission in one simple partner area.",
  applicationName: "Tabbio Partners",
  authors: [{ name: "Tabbio" }],
  creator: "Tabbio",
  publisher: "Tabbio",
  formatDetection: { email: false, address: false, telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable}`}>
        <a className="skip-link focus-ring" href="#main-content">
          Skip to main content
        </a>
        <DemoProvider>{children}</DemoProvider>
        <Toaster richColors closeButton position="bottom-center" />
      </body>
    </html>
  );
}
