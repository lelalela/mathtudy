'use client';

import React, { useRef, useState } from 'react';
import { exportProgressAsJson, importProgressFromJson } from '@/lib/storage';
import { Download, Upload, ShieldCheck, Check, AlertCircle, X } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportProgressAsJson();
    setStatusMsg({ text: '학습 데이터 백업 파일이 다운로드되었습니다.', success: true });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importProgressFromJson(content);
      if (success) {
        setStatusMsg({ text: '데이터 복원이 완료되었습니다!', success: true });
        onRefresh();
      } else {
        setStatusMsg({ text: '올바르지 않은 백업 파일 형식입니다.', success: false });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>로컬 데이터 백업 & 복원</span>
          </div>
          <h3 className="text-xl font-bold text-neutral-100">데이터 영구 보관 관리</h3>
          <p className="text-xs text-neutral-400">
            브라우저 캐시 삭제나 다른 기기(모바일↔PC)로 학습 기록을 이동할 때 간편하게 파일을 주고받을 수 있습니다.
          </p>
        </div>

        {statusMsg && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              statusMsg.success
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}
          >
            {statusMsg.success ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="w-full p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-left transition-all group"
          >
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-neutral-200 group-hover:text-white">
                내 학습 기록 백업 (JSON 다운로드)
              </span>
              <p className="text-xs text-neutral-500">현재까지 푼 문제 수, 정답률, 진도율 파일 저장</p>
            </div>
            <div className="p-2 rounded-xl bg-neutral-800 group-hover:bg-neutral-700 text-neutral-300">
              <Download className="w-4 h-4" />
            </div>
          </button>

          {/* Import Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-left transition-all group"
          >
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-neutral-200 group-hover:text-white">
                백업 파일에서 복원하기
              </span>
              <p className="text-xs text-neutral-500">이전에 저장한 JSON 백업 파일을 불러와 복원</p>
            </div>
            <div className="p-2 rounded-xl bg-neutral-800 group-hover:bg-neutral-700 text-neutral-300">
              <Upload className="w-4 h-4" />
            </div>
          </button>
        </div>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-neutral-500">
            ※ 데이터는 외부 서버로 전송되지 않으며 브라우저 내부에만 안전하게 머뭅니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackupModal;
