import type { Metadata } from "next";
import "./globals.css";
import "./main.css";

export const metadata: Metadata = {
  title: "Lestow — AI Website Builder",
  description: "Create your website with Lestow AI in minutes",
  icons: {
    icon: "/fav-icon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-dvh overflow-x-hidden overflow-y-auto">
        {children}
      </body>
    </html>
  );
}
