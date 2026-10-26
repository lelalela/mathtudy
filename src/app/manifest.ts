import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mathtudy - 성인을 위한 수학 독학 플랫폼',
    short_name: 'Mathtudy',
    description: '기초 산수부터 고급수학까지, 교재형 개념 정리와 무한 알고리즘 연습 드릴 PWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
