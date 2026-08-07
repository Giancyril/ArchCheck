import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI System Design Reviewer",
  description:
    "Upload an architecture diagram and get instant AI-powered feedback on scalability, reliability, bottlenecks, and design trade-offs — plus a clean regenerated Mermaid.js diagram.",
  keywords: ["system design", "architecture review", "AI", "Mermaid", "scalability"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
