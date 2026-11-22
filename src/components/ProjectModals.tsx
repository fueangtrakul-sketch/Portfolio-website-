import { useEffect } from 'react';
import { X, ArrowUpRight, Play, Sparkles, Maximize2 } from 'lucide-react';
import type { FeaturedProject } from '../data/portfolioData';

interface ProjectDetailModalProps {
  project: FeaturedProject | null;
  onClose: () => void;
  onOpenLightbox: (src: string, alt: string, caption: string) => void;
  onOpenVideo: (project: FeaturedProject) => void;
  onOpenWebDemo: (project: FeaturedProject) => void;
}

export function ProjectDetailModal({
  project,
  onClose,
  onOpenLightbox,
  onOpenVideo,
  onOpenWebDemo,
}: ProjectDetailModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#02040B]/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl my-auto rounded-3xl border border-white/15 bg-[#080E20]/95 shadow-[0_32px_90px_-16px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="space-y-0.5 min-w-0">
            <div className="text-[11px] font-mono tracking-widest text-[#81F5BE] truncate">
              {project.categoryEn}
            </div>
            <h2 id="detail-modal-title" className="text-lg sm:text-xl font-semibold text-[#F4F7FB] truncate">
              เบื้องหลังผลงาน · {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#F4F7FB] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-7 max-h-[82vh] overflow-y-auto">
          {/* Interactive Visual Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-white/12 bg-[#04060F]">
            <img
              src={project.image}
              alt={project.imageAlt}
              className={`w-full ${
                project.aspectType === 'portrait-ui'
                  ? 'max-h-[380px] object-contain mx-auto py-3'
                  : 'max-h-[340px] object-cover'
              }`}
            />
            <button
              type="button"
              onClick={() => onOpenLightbox(project.image, project.imageAlt, `${project.title} — ${project.subtitle}`)}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-[#04060F]/85 text-[#F4F7FB] border border-white/20 hover:border-[#5DF0A8]/60 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>ขยายเต็มจอ</span>
            </button>
          </div>

          {/* Role & Tools (Unboxed metadata) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#B8C4D9]">
            <span className="text-[#81F5BE] font-medium">บทบาท: {project.role}</span>
            <span aria-hidden="true">·</span>
            <span>{project.tools.join(' · ')}</span>
          </div>

          {/* 3-Part Story: โจทย์ / วิธีคิด / สิ่งที่ได้ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-1.5">
              <div className="text-xs font-mono tracking-wider text-[#81F5BE]">01 · โจทย์</div>
              <p className="text-sm text-[#D8E1F0] leading-relaxed">{project.challenge}</p>
            </div>
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-1.5">
              <div className="text-xs font-mono tracking-wider text-[#F5C26B]">02 · วิธีคิด</div>
              <p className="text-sm text-[#D8E1F0] leading-relaxed">{project.thinking}</p>
            </div>
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-1.5">
              <div className="text-xs font-mono tracking-wider text-[#8CC2FF]">03 · สิ่งที่ได้</div>
              <p className="text-sm text-[#D8E1F0] leading-relaxed">{project.outcome}</p>
            </div>
          </div>

          {/* Behind the scenes bullet insights */}
          <div className="space-y-3 border-t border-white/10 pt-5">
            <h3 className="text-sm font-semibold text-[#F4F7FB] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5DF0A8]" />
              <span>เบื้องหลังกระบวนการคิดและพัฒนา</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-[#B8C4D9] leading-relaxed">
              {project.behindTheScenes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#81F5BE] mt-1 shrink-0">
                    0{idx + 1}
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveUrl && (
              <button
                type="button"
                onClick={() => onOpenWebDemo(project)}
                className="btn-capsule-primary"
              >
                <span>ทดลองใช้งาน {project.title}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
            {project.videoPreviewUrl && (
              <button
                type="button"
                onClick={() => onOpenVideo(project)}
                className="btn-capsule-primary"
              >
                <Play className="w-4 h-4" />
                <span>เปิดดูวิดีโอนำเสนอ</span>
              </button>
            )}
            {project.driveUrl && (
              <a
                href={project.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-capsule-secondary"
              >
                <span>เปิดต้นฉบับใน Google Drive</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LightboxModalProps {
  media: { src: string; alt: string; caption: string } | null;
  onClose: () => void;
}

export function LightboxModal({ media, onClose }: LightboxModalProps) {
  useEffect(() => {
    if (!media) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [media, onClose]);

  if (!media) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="มุมมองภาพขยายเต็มจอ"
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-[#02040B]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="ปิดภาพขยาย"
        className="fixed top-5 right-5 w-11 h-11 rounded-full border border-white/20 bg-[#080E20]/90 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-4"
      >
        <img
          src={media.src}
          alt={media.alt}
          className="max-h-[76vh] w-auto object-contain rounded-2xl border border-white/12 shadow-2xl"
        />
        <p className="text-sm text-[#D8E1F0] text-center">{media.caption}</p>
      </div>
    </div>
  );
}

interface VideoModalProps {
  project: FeaturedProject | null;
  onClose: () => void;
}

export function VideoModal({ project, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [project, onClose]);

  if (!project || !project.videoPreviewUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-[#02040B]/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-3xl border border-white/15 bg-[#080E20] overflow-hidden shadow-2xl"
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-mono text-[#81F5BE] truncate">
              VIDEO SHOWCASE · {project.videoMeta?.filename || 'Video'} · {project.videoMeta?.sizeLabel || ''}
            </div>
            <h2 id="video-modal-title" className="text-base sm:text-lg font-semibold text-[#F4F7FB] truncate">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่างวิดีโอ"
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loaded ONLY on demand when modal opens; unmounted immediately on close */}
        <div className="aspect-video w-full bg-black">
          <iframe
            src={project.videoPreviewUrl}
            title={project.title}
            allow="autoplay; fullscreen"
            className="w-full h-full border-0"
          />
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#B8C4D9]">
          <span>{project.videoMeta?.note || 'วิดีโอโหลดเมื่อกดเปิดเท่านั้น และไม่เปิดเสียงอัตโนมัติ'}</span>
          {project.driveUrl && (
            <a
              href={project.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[#81F5BE] hover:underline"
            >
              <span>เปิดดูไฟล์ต้นฉบับใน Google Drive</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

interface WebDemoModalProps {
  project: FeaturedProject | null;
  onClose: () => void;
}

export function WebDemoModal({ project, onClose }: WebDemoModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [project, onClose]);

  if (!project || !project.liveUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="webdemo-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-[#02040B]/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#080E20] overflow-hidden shadow-2xl"
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-mono text-[#F5C26B] truncate">
              LIVE WEB PROTOTYPE · {project.liveUrl}
            </div>
            <h2 id="webdemo-modal-title" className="text-lg font-semibold text-[#F4F7FB] truncate">
              {project.title} — {project.subtitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่างทดลองเว็บ"
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="rounded-2xl overflow-hidden border border-white/12 bg-[#04060F]">
            <img
              src={project.image}
              alt={project.imageAlt}
              className="w-full max-h-[300px] object-cover"
            />
          </div>
          <p className="text-sm text-[#D4DCEA] leading-relaxed">
            เว็บแอป <span className="font-semibold text-white">{project.title}</span> เปิดใช้งานจริงที่{' '}
            <span className="font-mono text-[#81F5BE]">{project.liveUrl}</span>{' '}
            (เซิร์ฟเวอร์ตั้งค่าความปลอดภัยไม่อนุญาตให้ฝังผ่าน iframe เพื่อป้องกันการคลิกแจ็กกิ้ง จึงแนะนำให้เปิดใช้งานเต็มหน้าจอในแท็บใหม่)
          </p>
          <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-capsule-secondary">
              ปิดหน้าต่าง
            </button>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-capsule-primary"
            >
              <span>เปิดเว็บ {project.title} เต็มหน้าจอ</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
