'use client';

import React, { useEffect, useState } from 'react';
import { DownloadCloud, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  });

  const [isIOS] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  });

  const [showIosTip, setShowIosTip] = useState<boolean>(false);

  useEffect(() => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('PWA ServiceWorker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('PWA ServiceWorker registration failed:', err);
          });
      });
    }

    // Capture Chrome/Edge beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) return;

    if (deferredPrompt) {
      // Trigger native browser install prompt
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIosTip(true);
      setTimeout(() => setShowIosTip(false), 5000);
    } else {
      // Fallback tip for desktop/browser
      alert("브라우저 주소창 우측의 '앱 설치' (또는 다운로드 아이콘)을 클릭하거나, 브라우저 메뉴에서 '앱 설치'를 선택해 주세요.");
    }
  };

  if (isInstalled) {
    return (
      <div
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md3-full bg-surface-container-high border border-outline-variant/50 text-xs text-on-surface-variant font-medium select-none"
        title="PWA 앱이 이미 설치되어 실행 중입니다."
      >
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden lg:inline">앱 설치됨</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleInstallClick}
        className="h-9 px-3.5 rounded-md3-full bg-primary hover:brightness-110 active:scale-95 text-on-primary text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
        title="브라우저 없이 앱으로 설치하여 오프라인에서 실행"
      >
        <DownloadCloud className="w-4 h-4" />
        <span className="hidden sm:inline">앱 다운로드</span>
      </button>

      {/* iOS Safari tooltip */}
      {showIosTip && (
        <div className="absolute top-11 right-0 w-64 p-3.5 bg-surface-container-high border border-outline-variant rounded-md3-lg shadow-xl text-xs text-on-surface z-50 animate-fade-in space-y-1">
          <p className="font-semibold text-primary">아이폰 / 아이패드 설치 방법:</p>
          <p className="text-on-surface-variant leading-relaxed">
            사파리 하단의 <span className="font-bold">공유 버튼</span>(네모 위 화살표)을 누른 후 <span className="font-bold text-on-surface">‘홈 화면에 추가’</span>를 선택하세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default PwaInstallButton;
