import type { Metadata } from "next";
import { Inter, Roboto_Mono, Montserrat } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: "PAM TRAX",
  description: "Music label inspired by the spirit of Pam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable} ${montserrat.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}