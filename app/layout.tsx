import type { Metadata } from "next";
import "./globals.css";
import "./hero-overrides.css";

export const metadata: Metadata = {
  title: "Jeremiah Emery | Producer & Software Engineer",
  description: "Music, beats, software and the creative journey of producer and software engineer Jeremiah Emery.",
  metadataBase: new URL("https://jeremiah-emery.arcane-bread-5846.chatgpt.site"),
  openGraph: {
    title: "Jeremiah Emery | Producer & Software Engineer",
    description: "Music, beats, software and the creative journey of Jeremiah Emery.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeremiah Emery | Producer & Software Engineer",
    description: "Music, beats, software and the creative journey of Jeremiah Emery.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
