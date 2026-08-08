import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { Toaster } from "sonner";

import { DemoProvider } from "@/components/demo-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: { default: "Tabbio Partners", template: "%s · Tabbio Partners" },
  description: "A local frontend prototype of the Tabbio partner experience.",
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
