import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArchCheck — AI System Design Reviewer",
  description:
    "Upload any architecture diagram and receive instant AI-powered evaluation on scalability, reliability, bottlenecks, and design trade-offs — plus Mermaid.js diagram synthesis, cloud cost estimation, security auditing, and ready-to-deploy IaC.",
  keywords: ["system design", "architecture review", "AI", "Mermaid", "scalability", "security audit", "IaC", "Terraform", "Gemini"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "ArchCheck — AI System Design Reviewer",
    description: "Instant AI evaluation of your architecture diagram — scalability, reliability, security, cost & IaC.",
    type: "website",
  },
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
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
