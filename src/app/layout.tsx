import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'Mathtudy - 성인을 위한 수학 독학 플랫폼',
  description: '기초 산수부터 고급수학까지, 교재형 개념 정리와 무한 알고리즘 연습 드릴 PWA',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mathtudy',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased font-sans selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
