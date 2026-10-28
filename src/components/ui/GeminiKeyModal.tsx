'use client';

import React, { useState } from 'react';
import { getGeminiApiKey, setGeminiApiKey, removeGeminiApiKey } from '@/lib/gemini';
import { Key, Eye, EyeOff, ExternalLink, X, ShieldCheck, Trash2 } from 'lucide-react';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (newKey: string) => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [currentKey, setCurrentKey] = useState<string>(() => getGeminiApiKey() || '');
  const [inputKey, setInputKey] = useState<string>(() => getGeminiApiKey() || '');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = inputKey.trim();
    if (!trimmed) {
      setErrorMsg('API 키를 입력해 주세요.');
      return;
    }
    if (!trimmed.startsWith('AIza')) {
      // Gentle warning for typical Google API key format, but still allow save
    }
    setGeminiApiKey(trimmed);
    setCurrentKey(trimmed);
    setErrorMsg('');
    onKeySaved(trimmed);
    onClose();
  };

  const handleDelete = () => {
    removeGeminiApiKey();
    setCurrentKey('');
    setInputKey('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-surface-container-high border border-outline-variant/60 rounded-md3-xl p-6 shadow-2xl space-y-5 text-on-surface">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md3-full bg-primary/20 text-primary">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-on-surface">Gemini API 키 설정</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md3-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security & Description */}
        <div className="space-y-2 text-xs leading-relaxed text-on-surface-variant">
          <p>
            AI 튜터 풀이 기능을 이용하려면 개인 <strong>Google Gemini API 키</strong>가 필요합니다.
          </p>
          <div className="p-2.5 bg-surface-container rounded-md3-md border border-outline-variant/40 flex items-start gap-2 text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              입력하신 키는 오직 브라우저의 <strong>localStorage</strong>에만 안전하게 보관되며, Mathtudy의 어떤 서버로도 전송되지 않습니다.
            </span>
          </div>
        </div>

        {/* External Link */}
        <div className="text-xs">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
          >
            <span>Google AI Studio에서 무료 API 키 발급받기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Input Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-on-surface-variant">API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-md3-md text-xs font-mono text-on-surface focus:outline-none focus:border-primary pr-10 shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errorMsg && <p className="text-[11px] text-error font-medium">{errorMsg}</p>}
        </div>

        {/* Model Note */}
        <div className="text-[11px] text-on-surface-variant/70 leading-relaxed">
          ⚡ <strong>gemini-3.5-flash-lite</strong>를 우선 호출하며, 장애 시 <strong>gemini-3.8-flash</strong>로 자동 폴백(Fallback)됩니다.
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
          {currentKey ? (
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs text-error hover:bg-error/10 px-3 py-1.5 rounded-md3-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>키 삭제</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-on-surface-variant hover:text-on-surface rounded-md3-full hover:bg-surface-container-highest transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-on-primary bg-primary hover:brightness-110 active:scale-95 rounded-md3-full transition-all shadow-xs"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiKeyModal;
