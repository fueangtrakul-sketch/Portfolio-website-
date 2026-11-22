import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Camera,
  Check,
  Copy,
  FileText,
  Layers,
  Mail,
  Menu,
  MessageCircle,
  Pause,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import { PORTFOLIO_DATA } from './data/portfolioData';
import type { FeaturedProject } from './data/portfolioData';
import { WorldCanvas } from './components/WorldCanvas';
import { ScrollReveal } from './components/ScrollReveal';
import { Portrait3DCarousel } from './components/Portrait3DCarousel';
import {
  LightboxModal,
  ProjectDetailModal,
  VideoModal,
  WebDemoModal,
} from './components/ProjectModals';
import { OfflineIndicator, PWAInstallButton } from './components/PWAInstallButton';

export default function App() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [manualReduceMotion, setManualReduceMotion] = useState(false);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [detailProject, setDetailProject] = useState<FeaturedProject | null>(null);
  const [lightboxMedia, setLightboxMedia] = useState<{
    src: string;
    alt: string;
    caption: string;
  } | null>(null);
  const [videoProject, setVideoProject] = useState<FeaturedProject | null>(null);
  const [webDemoProject, setWebDemoProject] = useState<FeaturedProject | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const reduceMotion = manualReduceMotion || systemReduceMotion;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemReduceMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (reduceMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [reduceMotion]);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const pct = Math.min(100, Math.max(0, Math.round((window.scrollY / maxScroll) * 100)));
      setScrollPercent(pct);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToId = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const handleCopyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((curr) => (curr === key ? null : curr)), 2000);
    } catch {
      // ignore if clipboard blocked
    }
  };

  const { owner, categories, projects, skills, aboutSlides } = PORTFOLIO_DATA;

  return (
    <div className="relative min-h-screen bg-[#04060F] text-[#F4F7FB]">
      {/* Skip Link */}
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#5DF0A8] focus:text-[#04060F] focus:font-semibold"
      >
        ข้ามไปดูผลงาน
      </a>

      {/* Scroll-Choreographed Background Canvas */}
      <WorldCanvas reduceMotion={reduceMotion} />

      {/* Top Reading Progress Line */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/5 pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-[#5DF0A8] via-[#81F5BE] to-[#F5C26B] transition-[width] duration-75"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10">
        {/* Top Bar (Brand Left · Center Nav · Contact CTA Right) */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#04060F]/72 backdrop-blur-xl">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-8">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
              }}
              className="text-base sm:text-lg font-bold tracking-tight text-[#F4F7FB] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5DF0A8]"
            >
              {owner.brandEn}
            </a>

            <nav
              aria-label="เมนูหลัก"
              className="hidden md:flex items-center gap-7 text-sm font-medium text-[#B8C4D9]"
            >
              {[
                { id: 'work', label: 'ผลงาน' },
                { id: 'social', label: 'ช่องทาง' },
                { id: 'about', label: 'เกี่ยวกับฉัน' },
                { id: 'skills', label: 'ทักษะ' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToId(item.id)}
                  className="py-1 hover:text-[#81F5BE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => scrollToId('contact')}
                className="hidden sm:inline-flex btn-capsule-secondary text-xs py-2 px-4"
              >
                <span>ติดต่อพูดคุย</span>
                <span aria-hidden="true">↗</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
                aria-expanded={mobileMenuOpen}
                className="md:hidden w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[#F4F7FB]"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 bg-[#050917]/95 backdrop-blur-xl px-5 py-4 space-y-2">
              {[
                { id: 'work', label: 'ผลงานเด่น' },
                { id: 'social', label: 'ช่องทางโซเชียล' },
                { id: 'about', label: 'เกี่ยวกับฉัน' },
                { id: 'skills', label: 'ทักษะหลัก' },
                { id: 'contact', label: 'ติดต่อพูดคุย' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToId(item.id)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#E2E8F5] hover:bg-white/5 hover:text-[#81F5BE]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* HERO SECTION */}
        <section
          id="top"
          className="relative min-h-[calc(100svh-72px)] flex flex-col justify-between overflow-hidden"
        >
          {/* Masked Atmospheric Backdrop blending seamlessly into #04060F */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <img
              src={owner.heroBackdropImage}
              alt=""
              className="hero-mask-fade w-full max-w-[1160px] h-[72vh] object-cover opacity-30 sm:opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#04060F]/70 via-[#04060F]/35 to-[#04060F]" />
          </div>

          {/* Animated SVG Bezier Energy Curves */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 420"
            className="absolute inset-0 w-full h-full pointer-events-none opacity-65"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="fueang-energy-ink" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#5DF0A8" stopOpacity="0" />
                <stop offset="50%" stopColor="#9BFFCF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#74AAFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M60 330 C240 420 370 320 520 220 S810 20 950 100"
              fill="none"
              stroke="url(#fueang-energy-ink)"
              strokeWidth="1"
            />
            <path
              d="M120 80 C320 0 720 460 900 290"
              fill="none"
              stroke="url(#fueang-energy-ink)"
              strokeWidth="0.65"
            />
            {!reduceMotion && (
              <>
                <circle r="2.6" fill="#A8FFE0">
                  <animateMotion
                    dur="9s"
                    repeatCount="indefinite"
                    path="M60 330 C240 420 370 320 520 220 S810 20 950 100"
                  />
                </circle>
                <circle r="1.8" fill="#F5C26B">
                  <animateMotion
                    dur="12s"
                    repeatCount="indefinite"
                    path="M120 80 C320 0 720 460 900 290"
                  />
                </circle>
              </>
            )}
          </svg>

          {/* Hero Center Content */}
          <div className="relative z-10 max-w-[1120px] w-full mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-8 my-auto text-center space-y-7">
            <ScrollReveal reduceMotion={reduceMotion}>
              <p className="inline-flex items-center justify-center gap-2.5 text-[11px] sm:text-xs font-mono tracking-[0.22em] text-[#B8C4D9]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5DF0A8] shadow-[0_0_10px_#5DF0A8]" />
                <span>{owner.heroEyebrow}</span>
              </p>
            </ScrollReveal>

            <ScrollReveal delayMs={80} reduceMotion={reduceMotion}>
              <h1 className="text-[clamp(2.35rem,6.5vw,5.15rem)] font-bold leading-[1.15] tracking-tight text-balance max-w-4xl mx-auto">
                <span className="block text-[#F4F7FB]">{owner.heroHeadlineLine1}</span>
                <span className="block mint-gradient-text mt-1">
                  {owner.heroHeadlineLine2}
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delayMs={160} reduceMotion={reduceMotion}>
              <p className="text-sm sm:text-lg text-[#C4D0E3] max-w-2xl mx-auto leading-relaxed">
                {owner.heroSub}
              </p>
            </ScrollReveal>

            <ScrollReveal delayMs={240} reduceMotion={reduceMotion}>
              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToId('work')}
                  className="btn-capsule-primary"
                >
                  <span>สำรวจผลงาน</span>
                  <span aria-hidden="true">↗</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId('about')}
                  className="btn-capsule-secondary"
                >
                  <span>รู้จักฉันให้มากขึ้น</span>
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Hero Bottom Scroll Cue */}
          <div className="relative z-10 max-w-[1280px] w-full mx-auto px-5 sm:px-8 pb-8 flex items-end justify-between gap-4 text-xs text-[#9AA9C2]">
            <button
              type="button"
              onClick={() => scrollToId('work')}
              className="inline-flex items-center gap-3 text-left hover:text-[#81F5BE] transition-colors group"
            >
              <span
                aria-hidden="true"
                className="w-[1px] h-9 bg-gradient-to-b from-[#5DF0A8] to-transparent block"
              />
              <span className="leading-snug">
                <strong className="block text-xs font-medium text-[#E4ECF8] group-hover:text-[#81F5BE]">
                  เลื่อน แล้วออกเดินทางไปด้วยกัน
                </strong>
                <span className="font-mono text-[10px] tracking-[0.18em]">
                  SCROLL TO EXPLORE
                </span>
              </span>
            </button>

            <div className="text-right hidden sm:block leading-snug">
              <strong className="block text-[11px] font-mono tracking-[0.16em] text-[#D8E1F0]">
                {owner.roleLine.toUpperCase()}
              </strong>
              <span className="font-mono text-[10px] tracking-[0.16em] text-[#8E9EB8]">
                M.6 · PREPARING FOR IT KMITL
              </span>
            </div>
          </div>
        </section>

        {/* DISCIPLINE STRIP */}
        <div className="border-y border-white/10 bg-[#04060F]/45 backdrop-blur-sm">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-6 flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-3 text-[11px] font-mono tracking-[0.18em] text-[#A8B7D0]">
            <span>UX/UI DESIGN</span>
            <span aria-hidden="true" className="text-[#5DF0A8]">·</span>
            <span>WIREFRAME &amp; PROTOTYPE</span>
            <span aria-hidden="true" className="text-[#5DF0A8]">·</span>
            <span>GRAPHIC DESIGN</span>
            <span aria-hidden="true" className="text-[#5DF0A8]">·</span>
            <span>VIDEO EDITING</span>
            <span aria-hidden="true" className="text-[#5DF0A8]">·</span>
            <span>WEB PROTOTYPING</span>
          </div>
        </div>

        {/* FEATURED WORKS — ASYMMETRIC SCROLL CHAPTERS */}
        <main>
          <section id="work" className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-16">
            <ScrollReveal reduceMotion={reduceMotion}>
              <div className="max-w-3xl space-y-5">
                <p className="text-xs font-mono tracking-[0.22em] text-[#81F5BE]">
                  SELECTED WORK / IDEAS IN ACTION
                </p>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.18] tracking-tight text-balance">
                  ไอเดียที่ดี.
                  <br />
                  <span className="mint-gradient-text">
                    ต้องใช้งานได้จริงและตอบโจทย์ผู้คน.
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-[#B8C4D9] leading-relaxed max-w-2xl">
                  รวมผลงานที่ตั้งใจออกแบบจากปัญหาจริงในชีวิตประจำวัน ตั้งแต่ระบบฝากซื้ออาหารในหอพัก เว็บต้นแบบ AI ไปจนถึงงานกราฟิกและวิดีโอนำเสนอ
                </p>
              </div>
            </ScrollReveal>

            {/* Category Jump Navigation */}
            <nav
              aria-label="เลือกหมวดผลงาน"
              className="mt-10 flex flex-wrap items-center gap-3 border-b border-white/10 pb-8"
            >
              {categories.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollToId(cat.anchorId)}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/12 bg-white/[0.03] hover:border-[#5DF0A8]/50 hover:bg-[#5DF0A8]/10 text-xs sm:text-sm text-[#E4ECF8] transition-colors whitespace-nowrap"
                >
                  <span className="font-mono text-[11px] text-[#81F5BE]">
                    0{idx + 1}
                  </span>
                  <span>{cat.labelTh}</span>
                </button>
              ))}
            </nav>

            {/* Editorial Alternating Project Chapters */}
            <div className="mt-20 sm:mt-28 space-y-28 sm:space-y-40">
              {projects.map((project, index) => {
                const isReversed = index % 2 === 1;
                const anchorId =
                  project.id === 'hiewhiw'
                    ? 'project-hiewhiw'
                    : project.id === 'pet-mood'
                    ? 'project-pet-mood'
                    : 'project-graphic-video';

                return (
                  <article
                    key={project.id}
                    id={anchorId}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center scroll-mt-24"
                  >
                    {/* Story & 3-Part Breakdown */}
                    <div
                      className={`lg:col-span-6 space-y-6 ${
                        isReversed ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <ScrollReveal reduceMotion={reduceMotion}>
                        <div className="space-y-3">
                          <div className="text-[11px] font-mono tracking-[0.2em] text-[#81F5BE]">
                            {project.categoryEn}
                          </div>
                          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F7FB]">
                            {project.title}
                          </h3>
                          <p className="text-base sm:text-lg text-[#D8E1F0] font-medium">
                            {project.subtitle}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#9BB0CC]">
                            <span>บทบาท: {project.role}</span>
                            <span aria-hidden="true">·</span>
                            <span>{project.tools.join(' · ')}</span>
                          </div>
                        </div>
                      </ScrollReveal>

                      {/* 3-Part Narrative: โจทย์ / วิธีคิด / สิ่งที่ได้ */}
                      <ScrollReveal delayMs={90} reduceMotion={reduceMotion}>
                        <dl className="space-y-4 border-t border-white/10 pt-5 text-sm leading-relaxed">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5 sm:gap-4">
                            <dt className="font-mono text-xs text-[#81F5BE] pt-0.5">
                              โจทย์
                            </dt>
                            <dd className="sm:col-span-3 text-[#C4D0E3]">
                              {project.challenge}
                            </dd>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5 sm:gap-4">
                            <dt className="font-mono text-xs text-[#F5C26B] pt-0.5">
                              วิธีคิด
                            </dt>
                            <dd className="sm:col-span-3 text-[#C4D0E3]">
                              {project.thinking}
                            </dd>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5 sm:gap-4">
                            <dt className="font-mono text-xs text-[#8CC2FF] pt-0.5">
                              สิ่งที่ได้
                            </dt>
                            <dd className="sm:col-span-3 text-[#C4D0E3]">
                              {project.outcome}
                            </dd>
                          </div>
                        </dl>
                      </ScrollReveal>

                      {/* Action Buttons */}
                      <ScrollReveal delayMs={150} reduceMotion={reduceMotion}>
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setDetailProject(project)}
                            className="btn-capsule-primary"
                          >
                            <span>ดูเบื้องหลัง</span>
                            <span aria-hidden="true">↗</span>
                          </button>

                          {project.liveUrl && (
                            <button
                              type="button"
                              onClick={() => setWebDemoProject(project)}
                              className="btn-capsule-secondary"
                            >
                              <span>ทดลองใช้งาน</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          )}

                          {project.videoPreviewUrl && (
                            <button
                              type="button"
                              onClick={() => setVideoProject(project)}
                              className="btn-capsule-secondary"
                            >
                              <Play className="w-3.5 h-3.5 text-[#81F5BE]" />
                              <span>เล่นวิดีโอนำเสนอ</span>
                            </button>
                          )}

                          {project.driveUrl && !project.videoPreviewUrl && (
                            <a
                              href={project.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-capsule-secondary"
                            >
                              <span>เปิดไฟล์ต้นฉบับ</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </ScrollReveal>
                    </div>

                    {/* Visual Showcase */}
                    <div
                      className={`lg:col-span-6 ${
                        isReversed ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <ScrollReveal delayMs={120} reduceMotion={reduceMotion}>
                        <div className="group relative rounded-3xl border border-white/12 bg-[#070B19]/75 overflow-hidden shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)]">
                          <button
                            type="button"
                            onClick={() =>
                              setLightboxMedia({
                                src: project.image,
                                alt: project.imageAlt,
                                caption: `${project.title} — ${project.subtitle}`,
                              })
                            }
                            aria-label={`เปิดดูภาพ ${project.title} เต็มหน้าจอ`}
                            className="block w-full text-left cursor-zoom-in"
                          >
                            {project.aspectType === 'portrait-ui' ? (
                              <div className="p-6 sm:p-8 bg-[radial-gradient(circle_at_50%_40%,rgba(93,240,168,0.12),rgba(4,6,15,0.95)_75%)] flex justify-center">
                                <img
                                  src={project.image}
                                  alt={project.imageAlt}
                                  loading="lazy"
                                  className="max-h-[440px] w-auto rounded-2xl border border-white/15 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                                />
                              </div>
                            ) : (
                              <img
                                src={project.image}
                                alt={project.imageAlt}
                                loading="lazy"
                                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                              />
                            )}
                          </button>

                          <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between gap-4 text-xs text-[#9BB0CC]">
                            <span className="truncate">
                              {project.videoMeta
                                ? `${project.videoMeta.filename} · ${project.videoMeta.sizeLabel}`
                                : project.liveUrl
                                ? project.liveUrl
                                : 'คลิกที่ภาพเพื่อขยายเต็มจอ'}
                            </span>
                            <span className="font-mono text-[11px] text-[#81F5BE] shrink-0">
                              #{project.number}
                            </span>
                          </div>
                        </div>
                      </ScrollReveal>
                    </div>
                  </article>
                );
              })}

              {/* Category 04: Photography Placeholder (Honest slot, no fake photos) */}
              <article
                id="project-photo"
                className="rounded-3xl border border-dashed border-white/18 bg-white/[0.02] p-8 sm:p-12 scroll-mt-24"
              >
                <ScrollReveal reduceMotion={reduceMotion}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-3">
                      <div className="text-[11px] font-mono tracking-[0.2em] text-[#F5C26B]">
                        04 / PHOTOGRAPHY &amp; VISUAL ARCHIVE
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F7FB]">
                        หมวดภาพถ่าย (Photography Slot)
                      </h3>
                      <p className="text-sm sm:text-base text-[#B8C4D9] leading-relaxed">
                        พื้นที่นี้เตรียมไว้สำหรับชุดภาพถ่ายจริงของคุณเฟื่อง เพื่อคงความซื่อสัตย์ต่อผลงานจริงโดยไม่สร้างภาพสมมติแทน — สามารถเพิ่มไฟล์ภาพถ่ายและคำบรรยายได้ทันทีใน{' '}
                        <span className="font-mono text-xs text-[#81F5BE]">src/data/portfolioData.ts</span>
                      </p>
                    </div>
                    <div className="lg:col-span-4 flex lg:justify-end">
                      <div className="inline-flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-white/12 bg-[#070B19]/80 text-xs text-[#C4D0E3]">
                        <Camera className="w-5 h-5 text-[#F5C26B] shrink-0" />
                        <span>รอเพิ่มไฟล์ภาพถ่ายจริงจากเจ้าของผลงาน</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </article>
            </div>
          </section>

          {/* SOCIAL CHANNELS SECTION */}
          <section id="social" className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 sm:py-28 scroll-mt-20">
            <ScrollReveal reduceMotion={reduceMotion}>
              <div className="space-y-4 mb-12">
                <p className="text-xs font-mono tracking-[0.22em] text-[#81F5BE]">
                  CHANNELS &amp; PRESENCE
                </p>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                  ติดตามผลงานและ<span className="gold-mint-text">พูดคุยแลกเปลี่ยนไอเดีย.</span>
                </h2>
                <p className="text-sm sm:text-base text-[#B8C4D9] max-w-2xl">
                  พื้นที่แบ่งปันมุมมองด้านการออกแบบ UX/UI เว็บต้นแบบ และการเตรียมตัวเข้าสู่สายเทคโนโลยีสารสนเทศ
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Primary Social Banner (Larger) */}
              <div className="lg:col-span-7 rounded-3xl border border-white/12 bg-[radial-gradient(circle_at_90%_10%,rgba(93,240,168,0.16),rgba(8,14,32,0.88)_60%)] p-7 sm:p-9 flex flex-col justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-mono tracking-[0.18em] text-[#81F5BE]">
                      PRIMARY CHANNEL · {owner.contact.socialPlatformLabel.toUpperCase()}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#81F5BE]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F7FB]">
                    @{owner.contact.socialHandle}
                  </h3>
                  <p className="text-sm sm:text-base text-[#C4D0E3] leading-relaxed max-w-xl">
                    ช่องทางหลักบน Facebook และ Instagram สำหรับอัปเดตโปรเจกต์ UX/UI งานกราฟิก การทดลอง AI และเบื้องหลังการสร้างเว็บต้นแบบ
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <div className="text-xs text-[#9BB0CC]">
                    บัญชี: <strong className="text-[#F4F7FB]">{owner.contact.socialHandle}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('social', owner.contact.socialHandle)}
                    className="btn-capsule-primary text-xs py-2.5 px-4"
                  >
                    {copiedKey === 'social' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>คัดลอกชื่อบัญชีแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกชื่อบัญชี {owner.contact.socialHandle}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Secondary Direct Contact & Portfolio Links */}
              <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                <div className="rounded-2xl border border-white/12 bg-[#080E20]/75 p-6 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="text-[11px] font-mono tracking-widest text-[#F5C26B]">
                      LINE CONTACT
                    </div>
                    <div className="text-lg font-semibold font-mono text-[#F4F7FB]">
                      {owner.contact.lineId}
                    </div>
                    <p className="text-xs text-[#9BB0CC]">ติดต่อสอบถามงานหรือพูดคุยโดยตรง</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('line', owner.contact.lineId)}
                    className="btn-capsule-secondary text-xs py-2 px-3.5 shrink-0"
                  >
                    {copiedKey === 'line' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#81F5BE]" />
                        <span>คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>คัดลอก LINE</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-2xl border border-white/12 bg-[#080E20]/75 p-6 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="text-[11px] font-mono tracking-widest text-[#81F5BE]">
                      EMAIL
                    </div>
                    <div className="text-base font-semibold font-mono text-[#F4F7FB] truncate">
                      {owner.contact.email}
                    </div>
                    <p className="text-xs text-[#9BB0CC]">สำหรับติดต่องานและข้อมูลเพิ่มเติม</p>
                  </div>
                  <a
                    href={`mailto:${owner.contact.email}`}
                    className="btn-capsule-secondary text-xs py-2 px-3.5 shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>ส่งอีเมล ↗</span>
                  </a>
                </div>

                <div className="rounded-2xl border border-white/12 bg-[#080E20]/75 p-6 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="text-[11px] font-mono tracking-widest text-[#8CC2FF]">
                      RESUME / PORTFOLIO DECK
                    </div>
                    <div className="text-sm font-medium text-[#F4F7FB]">
                      แฟ้มสะสมผลงานฉบับ Canva
                    </div>
                    <p className="text-xs text-[#9BB0CC] truncate">canva.link/zj63ooopi7vtdya</p>
                  </div>
                  <a
                    href={owner.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-capsule-secondary text-xs py-2 px-3.5 shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>เปิดดู ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT ME + 3D PERSPECTIVE GALLERY */}
          <section id="about" className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 sm:py-28 scroll-mt-20">
            <div className="rounded-3xl border border-white/12 bg-[#070B19]/75 backdrop-blur-xl p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <ScrollReveal reduceMotion={reduceMotion}>
                  <div className="space-y-3">
                    <p className="text-xs font-mono tracking-[0.22em] text-[#81F5BE]">
                      ABOUT ME · THE PERSON BEHIND THE SCREEN
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-[#F4F7FB]">
                      {owner.fullName}
                    </h2>
                    <p className="text-sm font-mono text-[#F5C26B]">
                      ชื่อเล่น: {owner.shortName} · {owner.roleLine}
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delayMs={80} reduceMotion={reduceMotion}>
                  <div className="space-y-4 text-sm sm:text-base text-[#C4D0E3] leading-relaxed">
                    <p>{owner.heroSub}</p>
                    <p className="text-[#E4ECF8] font-medium">{owner.targetUniversity}</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delayMs={140} reduceMotion={reduceMotion}>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={owner.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-capsule-primary"
                    >
                      <FileText className="w-4 h-4" />
                      <span>เปิด Portfolio / Resume</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                    <a
                      href={`mailto:${owner.contact.email}`}
                      className="btn-capsule-secondary"
                    >
                      <span>ส่งอีเมลทักทาย</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-6">
                <Portrait3DCarousel slides={aboutSlides} reduceMotion={reduceMotion} />
              </div>
            </div>
          </section>

          {/* CORE SKILLS */}
          <section id="skills" className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 sm:py-28 scroll-mt-20">
            <ScrollReveal reduceMotion={reduceMotion}>
              <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
                <div className="space-y-3">
                  <p className="text-xs font-mono tracking-[0.22em] text-[#81F5BE]">
                    THE CREATIVE TOOLKIT
                  </p>
                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                    ทักษะหลักที่ทำงาน
                    <br />
                    <span className="mint-gradient-text">เชื่อมต่อกันเป็นระบบ.</span>
                  </h2>
                </div>
                <p className="text-sm text-[#B8C4D9]">
                  กดที่ทักษะแต่ละด้านเพื่อข้ามไปยังผลงานที่เกี่ยวข้อง ↗
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {skills.map((skill, idx) => (
                <ScrollReveal key={skill.id} delayMs={idx * 50} reduceMotion={reduceMotion}>
                  <button
                    type="button"
                    onClick={() => scrollToId(skill.targetSectionId)}
                    className="group w-full h-full text-left rounded-2xl border border-white/12 bg-[#080E20]/70 hover:border-[#5DF0A8]/45 hover:bg-[#0B152C]/90 p-6 flex flex-col justify-between gap-6 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#81F5BE]">0{idx + 1} · {skill.nameEn}</span>
                        <Layers className="w-4 h-4 text-[#7F8FA8] group-hover:text-[#81F5BE] transition-colors" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#F4F7FB] group-hover:text-[#A8FFE0] transition-colors">
                        {skill.nameTh}
                      </h3>
                      <p className="text-sm text-[#B8C4D9] leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-[#81F5BE] flex items-center gap-1.5">
                      <span>ดูผลงานที่เกี่ยวข้อง</span>
                      <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  </button>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* CONTACT CTA */}
          <section id="contact" className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-10 pb-24 scroll-mt-20">
            <ScrollReveal reduceMotion={reduceMotion}>
              <div className="rounded-3xl border border-[#5DF0A8]/25 bg-[radial-gradient(circle_at_50%_0%,rgba(93,240,168,0.16),rgba(7,11,25,0.92)_68%)] p-8 sm:p-14 text-center space-y-7">
                <div className="space-y-3 max-w-2xl mx-auto">
                  <p className="text-xs font-mono tracking-[0.22em] text-[#81F5BE]">
                    LET&apos;S COLLABORATE
                  </p>
                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance">
                    พร้อมเรียนรู้ ลงมือทำ และ
                    <span className="mint-gradient-text">สร้างประสบการณ์ใหม่ไปด้วยกัน.</span>
                  </h2>
                  <p className="text-sm sm:text-base text-[#C4D0E3] leading-relaxed">
                    สามารถติดต่อพูดคุยเรื่องโปรเจกต์ UX/UI เว็บต้นแบบ หรืองานออกแบบกราฟิกและวิดีโอได้ทุกช่องทางด้านล่าง
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3.5">
                  <a
                    href={`mailto:${owner.contact.email}`}
                    className="btn-capsule-primary"
                  >
                    <Mail className="w-4 h-4" />
                    <span>ส่งอีเมล ({owner.contact.email})</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href={owner.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-capsule-secondary"
                  >
                    <FileText className="w-4 h-4" />
                    <span>เปิด Portfolio / Resume</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <PWAInstallButton />
                </div>

                <div className="pt-2 text-xs font-mono text-[#9BB0CC]">
                  LINE: {owner.contact.lineId} · {owner.contact.socialPlatformLabel}: {owner.contact.socialHandle}
                </div>
              </div>
            </ScrollReveal>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-[#03050C]/80">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-md">
              <div className="text-base font-bold tracking-tight text-[#F4F7FB]">
                {owner.brandEn} · {owner.fullName}
              </div>
              <p className="text-xs text-[#9AA9C2] leading-relaxed">
                ผมชื่อเฟื่อง เด็กที่หลงใหลในโลกของไอที — UX/UI Design, Graphic Designer &amp; Web Prototype
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#B8C4D9]">
              <button type="button" onClick={() => scrollToId('work')} className="hover:text-[#81F5BE]">
                ผลงาน
              </button>
              <button type="button" onClick={() => scrollToId('about')} className="hover:text-[#81F5BE]">
                เกี่ยวกับฉัน
              </button>
              <button type="button" onClick={() => scrollToId('skills')} className="hover:text-[#81F5BE]">
                ทักษะ
              </button>
              <a
                href={owner.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#81F5BE]"
              >
                Portfolio / Resume ↗
              </a>
              <a href={`mailto:${owner.contact.email}`} className="hover:text-[#81F5BE]">
                {owner.contact.email}
              </a>
            </div>
          </div>

          <div className="border-t border-white/5">
            <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[#7F8FA8]">
              <span>© 2026 {owner.fullName} ({owner.brandEn})</span>
              <span>BUILT FOR SMOOTH SCROLL &amp; ACCESSIBILITY</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Bottom-Right Floating Scene Progress & Reduce Motion Control */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-[#060A18]/85 backdrop-blur-md px-3.5 py-2 text-xs shadow-lg">
        <span className="font-mono tabular-nums text-[#81F5BE]">
          {String(scrollPercent).padStart(2, '0')}%
        </span>
        <span aria-hidden="true" className="text-white/20">|</span>
        <button
          type="button"
          onClick={() => setManualReduceMotion((v) => !v)}
          aria-pressed={reduceMotion}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#D8E1F0] hover:text-white whitespace-nowrap"
        >
          {reduceMotion ? (
            <>
              <Play className="w-3 h-3 text-[#81F5BE]" />
              <span>เปิดฉากเคลื่อนไหว</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-[#F5C26B]" />
              <span>ลดการเคลื่อนไหว</span>
            </>
          )}
        </button>
      </div>

      {/* Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Modals & Lightbox */}
      <ProjectDetailModal
        project={detailProject}
        onClose={() => setDetailProject(null)}
        onOpenLightbox={(src, alt, caption) => setLightboxMedia({ src, alt, caption })}
        onOpenVideo={(p) => {
          setDetailProject(null);
          setVideoProject(p);
        }}
        onOpenWebDemo={(p) => {
          setDetailProject(null);
          setWebDemoProject(p);
        }}
      />

      <LightboxModal media={lightboxMedia} onClose={() => setLightboxMedia(null)} />
      <VideoModal project={videoProject} onClose={() => setVideoProject(null)} />
      <WebDemoModal project={webDemoProject} onClose={() => setWebDemoProject(null)} />
    </div>
  );
}
