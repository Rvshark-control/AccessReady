import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Fraunces } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

// Atkinson Hyperlegible Next was designed by the Braille Institute for low-vision readers.
const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin"],
  display: "swap",
  // next/font has no metric overrides for this family; fall back to the system UI font instead.
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AccessReady: Healthcare access, confirmed before you arrive",
    template: "%s · AccessReady",
  },
  description:
    "Your appointment is booked. But is it accessible? AccessReady helps disabled patients spot accommodation barriers before a visit, compare clinics, and prepare questions to ask. Prototype with fictional clinics.",
  applicationName: "AccessReady",
};

export const viewport: Viewport = {
  themeColor: "#24143d",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${atkinson.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="skip-link rounded-full bg-night-900 px-5 py-3 font-bold text-cream shadow-lift"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
