import type { Metadata } from "next";
import { Kaisei_Decol } from 'next/font/google'
import "./globals.css";

const kaiseiDecol = Kaisei_Decol({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={kaiseiDecol.className}>
        {children}
      </body>
    </html>
  );
}
