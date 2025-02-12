import { Kaisei_Decol, Cabin_Sketch } from 'next/font/google'
import "./globals.css";

export const kaiseiDecol = Kaisei_Decol({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const cabinSketch = Cabin_Sketch({
  subsets: ['latin'],
  weight: ['400', '700'],
});

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
