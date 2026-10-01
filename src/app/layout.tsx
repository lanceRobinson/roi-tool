import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Versapay ROI Calculator",
  description: "Interactive ROI calculator for Versapay solutions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0 }}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
