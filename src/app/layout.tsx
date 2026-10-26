import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'Mathtudy - Material 3 수학 독학 플랫폼',
  description: '기초 산수부터 고급수학까지, 교재형 개념 정리와 무한 알고리즘 연습 드릴 PWA',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#131318" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-surface text-on-surface antialiased font-sans selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
