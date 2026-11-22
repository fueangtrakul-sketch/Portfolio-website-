import { useState } from 'react';
import { Download, WifiOff, X } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="btn-capsule-secondary text-xs py-2 px-4"
      >
        <Download className="w-3.5 h-3.5 text-[#81F5BE]" />
        <span>ติดตั้งเป็นเว็บแอป (PWA)</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="btn-capsule-secondary text-xs py-2 px-4"
        >
          <Download className="w-3.5 h-3.5 text-[#81F5BE]" />
          <span>ติดตั้งบน iOS</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            onClick={() => setShowIOSGuide(false)}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#080E20] p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#F4F7FB]">
                  ติดตั้งบน iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="ปิดคำแนะนำ"
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-[#B8C4D9]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-[#D4DCEA] leading-relaxed">
                1. แตะปุ่ม <strong className="text-white">Share</strong> บนแถบ Safari
                <br />
                2. เลื่อนลงแล้วแตะ <strong className="text-white">Add to Home Screen</strong>
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="btn-capsule-primary w-full"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-[#F5C26B]/40 bg-[#0B1224]/95 px-3.5 py-2 text-xs font-medium text-[#F5C26B] shadow-lg backdrop-blur-md">
      <WifiOff className="w-3.5 h-3.5" />
      <span>โหมดออฟไลน์ · กำลังแสดงข้อมูลที่แคชไว้</span>
    </div>
  );
}
