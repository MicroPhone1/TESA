// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TESA Battle Field",
  description: "Mission dashboards",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-[#0b1220] text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
