import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, UserRound } from 'lucide-react';
import type { CarouselSlide } from '../data/portfolioData';

interface Portrait3DCarouselProps {
  slides: CarouselSlide[];
  reduceMotion: boolean;
}

export function Portrait3DCarousel({ slides, reduceMotion }: Portrait3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cameraTilt, setCameraTilt] = useState({ rx: 0, ry: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const count = slides.length;

  const goTo = (index: number) => {
    setActiveIndex(((index % count) + count) % count);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!reduceMotion && e.pointerType === 'mouse' && stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const rx = -((e.clientY - rect.top) / rect.height - 0.5) * 8;
      setCameraTilt({ rx, ry });
    }

    if (dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        setDragOffset(Math.max(-64, Math.min(64, dx * 0.35)));
      }
    }
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) {
        goTo(activeIndex + (dx < 0 ? 1 : -1));
      }
    }
    dragStartRef.current = null;
    setDragOffset(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(activeIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(activeIndex + 1);
    }
  };

  const activeSlide = slides[activeIndex];

  return (
    <div className="space-y-5">
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label="แกลเลอรีภาพ 3 มิติ ลากซ้ายขวาหรือใช้ปุ่มลูกศรเพื่อสลับมุม"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={() => {
          setCameraTilt({ rx: 0, ry: 0 });
          dragStartRef.current = null;
          setDragOffset(0);
        }}
        className="portrait-orbit-stage relative h-[440px] sm:h-[490px] w-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5DF0A8] rounded-2xl"
      >
        {/* Glowing Orbital Portal Rings behind 3D planes */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          <div className="w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,rgba(93,240,168,0.18)_0%,rgba(245,194,107,0.06)_48%,transparent_72%)] blur-xl" />
          <div
            className={`absolute w-[310px] h-[310px] rounded-full border border-[#5DF0A8]/25 ${
              reduceMotion ? '' : 'orbital-ring-spin'
            }`}
          />
          <div
            className="absolute w-[390px] h-[390px] rounded-full border border-[#F5C26B]/15"
            style={{ transform: 'rotateX(72deg) rotateZ(-18deg)' }}
          />
        </div>

        {/* 3D Camera Container */}
        <div
          className="portrait-orbit-camera relative w-[250px] sm:w-[275px] h-[350px] sm:h-[385px]"
          style={{
            transform: reduceMotion
              ? 'none'
              : `rotateX(${cameraTilt.rx}deg) rotateY(${cameraTilt.ry}deg) translateX(${dragOffset}px)`,
          }}
        >
          {slides.map((slide, idx) => {
            let slot = idx - activeIndex;
            if (slot > Math.floor(count / 2)) slot -= count;
            if (slot < -Math.floor(count / 2)) slot += count;
            const depth = Math.abs(slot);
            const isCurrent = slot === 0;

            return (
              <div
                key={slide.id}
                onClick={() => !isCurrent && goTo(idx)}
                className={`portrait-plane absolute inset-0 rounded-2xl overflow-hidden border ${
                  isCurrent
                    ? 'border-[#5DF0A8]/45 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9),0_0_40px_-14px_rgba(93,240,168,0.35)] cursor-default'
                    : 'border-white/15 cursor-pointer'
                } bg-[#080D1F]`}
                style={{
                  transform: `translateX(${slot * (depth === 1 ? 68 : 54)}%) translateZ(${
                    -depth * 140
                  }px) rotateY(${-slot * 22}deg) rotateZ(${slot * 2.5}deg)`,
                  opacity: depth === 0 ? 1 : depth === 1 ? 0.56 : 0.2,
                  zIndex: 10 - depth,
                }}
              >
                {slide.kind === 'placeholder' ? (
                  <div className="h-full w-full p-6 flex flex-col items-center justify-between text-center bg-[radial-gradient(circle_at_50%_25%,rgba(93,240,168,0.14),rgba(4,6,15,0.96)_72%)]">
                    <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-widest text-[#9BB0CC]">
                      <span>PORTRAIT SLOT</span>
                      <span>01</span>
                    </div>

                    <div className="space-y-4 my-auto">
                      <div className="w-20 h-20 mx-auto rounded-full border border-[#5DF0A8]/35 bg-[#5DF0A8]/10 flex items-center justify-center text-[#81F5BE]">
                        <UserRound className="w-9 h-9" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-[#F4F7FB]">
                          พื้นที่ภาพบุคคลของเฟื่อง
                        </p>
                        <p className="text-xs text-[#9BB0CC] leading-relaxed">
                          {slide.placeholderNote}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-[#5DF0A8]/85">
                      FUEANGTRAKUL · M.6 IT KMITL
                    </div>
                  </div>
                ) : (
                  <div className="relative h-full w-full">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#04060F] via-[#04060F]/70 to-transparent">
                      <p className="text-xs font-semibold text-[#F4F7FB]">{slide.label}</p>
                      <p className="text-[11px] text-[#B8C4D9]">{slide.sublabel}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom HUD Controls inside stage */}
        <div className="absolute bottom-2 inset-x-4 flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-2 bg-[#070B19]/85 backdrop-blur-md border border-white/15 rounded-full px-2 py-1">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="ดูภาพมุมก่อนหน้า"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#E2E8F5] hover:bg-white/10 hover:text-[#81F5BE] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono tabular-nums text-[#D4DCEA] px-1.5" aria-live="polite">
              {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} · {activeSlide.label}
            </span>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="ดูภาพมุมถัดไป"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#E2E8F5] hover:bg-white/10 hover:text-[#81F5BE] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-[#9BB0CC]">
            DRAG OR USE ARROWS ↔
          </span>
        </div>
      </div>

      {/* Thumbnail Switcher Strip */}
      <div className="grid grid-cols-3 gap-3" role="group" aria-label="เลือกมุมมองแกลเลอรี">
        {slides.map((slide, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(idx)}
              aria-pressed={isCurrent}
              className={`group text-left rounded-xl p-2 border transition-all ${
                isCurrent
                  ? 'border-[#5DF0A8]/55 bg-[#0B1726]/90'
                  : 'border-white/10 bg-[#080D1E]/60 hover:border-white/25'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#04060F] border border-white/10 shrink-0 flex items-center justify-center">
                  {slide.kind === 'placeholder' ? (
                    <UserRound className="w-4 h-4 text-[#81F5BE]" />
                  ) : (
                    <img
                      src={slide.image}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono tabular-nums text-[#81F5BE]">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="text-xs font-medium text-[#E8EEF8] truncate">
                    {slide.label}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
