import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PHC Copilot - AI Operations Assistant",
  description: "AI-powered operational decision support system for Primary Health Centres. Anticipate patient surges, manage medicine inventory, and optimize daily staff allocation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
