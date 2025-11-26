import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'CampusBrandAI | BITSoM Brand Copilot',
  description:
    'On-brand content assistant powered by BITSoM brand guidelines and AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body>{children}</body>
    </html>
  );
}
