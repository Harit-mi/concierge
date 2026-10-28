import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'VERITAS — Private Client Sourcing & Archival Procurement',
  description: "Bespoke personal shopping concierge for authentic designer runway apparel, rare footwear, and curated fashion accessories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#111215] selection:bg-[#E5D7BF] selection:text-[#111215]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
