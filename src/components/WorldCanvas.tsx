import { useEffect, useRef } from 'react';

interface WorldCanvasProps {
  reduceMotion: boolean;
}

interface Star {
  x: number;
  y: number;
  r: number;
  depth: number;
  alpha: number;
  twinkleOffset: number;
}

interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  depth: number;
  tone: 'mint' | 'gold' | 'blue';
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function WorldCanvas({ reduceMotion }: WorldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();

    const isCompact = width < 768;
    const starCount = isCompact ? 65 : 130;
    const dustCount = isCompact ? 22 : 48;

    const stars: Star[] = Array.from({ length: starCount }, (_, i) => ({
      x: ((i * 7919) % 1000) / 1000,
      y: ((i * 4127) % 1000) / 1000,
      r: 0.6 + ((i * 17) % 10) * 0.14,
      depth: 0.25 + ((i * 31) % 10) * 0.08,
      alpha: 0.22 + ((i * 13) % 10) * 0.06,
      twinkleOffset: i * 0.7,
    }));

    const dust: Dust[] = Array.from({ length: dustCount }, (_, i) => ({
      x: ((i * 3571) % 1000) / 1000,
      y: ((i * 6133) % 1000) / 1000,
      vx: (((i % 7) - 3) * 0.000018),
      vy: (-0.00002 - (i % 5) * 0.000008),
      r: 1.1 + (i % 4) * 0.6,
      depth: 0.5 + (i % 6) * 0.15,
      tone: i % 3 === 0 ? 'mint' : i % 3 === 1 ? 'gold' : 'blue',
    }));

    let targetScroll = 0;
    let smoothScroll = 0;

    const updateScrollTarget = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = clamp(window.scrollY / maxScroll, 0, 1);
    };
    updateScrollTarget();

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', updateScrollTarget, { passive: true });

    let rafId = 0;
    const startTime = performance.now();

    const drawFrame = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      smoothScroll = reduceMotion
        ? targetScroll
        : lerp(smoothScroll, targetScroll, 0.09);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Base deep midnight navy canvas (#04060F)
      ctx.fillStyle = '#04060F';
      ctx.fillRect(0, 0, width, height);

      // Scroll-choreographed portal color phase:
      // 0.0 -> emerald-mint, 0.35 -> warm gold, 0.70 -> emerald-cyan, 1.0 -> soft mint-gold horizon
      const goldPhase = Math.sin(clamp((smoothScroll - 0.14) / 0.34, 0, 1) * Math.PI);
      const mintPhase = 1 - goldPhase * 0.55;

      // Portal center drifts smoothly across viewport as chapters alternate
      const portalX =
        width *
        (0.5 +
          Math.sin(smoothScroll * Math.PI * 2.1) * (isCompact ? 0.12 : 0.22));
      const portalY =
        height *
        (0.46 + Math.cos(smoothScroll * Math.PI * 1.4) * 0.12);
      const portalScale = 1 + Math.sin(smoothScroll * Math.PI * 2) * 0.18;

      // Atmospheric radial nebula behind portal
      const nebulaRadius = Math.max(width, height) * 0.62 * portalScale;
      const nebula = ctx.createRadialGradient(
        portalX,
        portalY,
        10,
        portalX,
        portalY,
        nebulaRadius
      );
      const rGlow = Math.round(lerp(22, 165, goldPhase));
      const gGlow = Math.round(lerp(130, 125, goldPhase));
      const bGlow = Math.round(lerp(105, 58, goldPhase));
      nebula.addColorStop(0, `rgba(${rGlow}, ${gGlow}, ${bGlow}, 0.16)`);
      nebula.addColorStop(0.42, `rgba(18, 46, 82, ${0.14 * mintPhase})`);
      nebula.addColorStop(1, 'rgba(4, 6, 15, 0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      // Multi-depth parallax starfield
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const py = ((s.y - smoothScroll * s.depth * 0.55) % 1 + 1) % 1;
        const px = s.x * width;
        const yPos = py * height;
        const twinkle = reduceMotion
          ? 1
          : 0.72 + 0.28 * Math.sin(elapsed * 1.4 + s.twinkleOffset);
        ctx.fillStyle = `rgba(216, 230, 255, ${(s.alpha * twinkle).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, yPos, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Luminous portal rings (ประตูมิติ)
      const baseRingR = Math.min(width, height) * (isCompact ? 0.28 : 0.24) * portalScale;
      const ringSpecs = [
        { scale: 0.88, tilt: 0.34, rot: smoothScroll * 1.6, alpha: 0.22, gold: goldPhase },
        { scale: 1.18, tilt: 0.42, rot: -smoothScroll * 1.2 + 0.5, alpha: 0.14, gold: goldPhase * 0.7 },
        { scale: 1.52, tilt: 0.3, rot: smoothScroll * 0.8 + 1.1, alpha: 0.08, gold: 1 - mintPhase },
      ];

      for (const ring of ringSpecs) {
        ctx.save();
        ctx.translate(portalX, portalY);
        ctx.rotate(ring.rot);
        ctx.scale(1, ring.tilt);
        const rr = Math.round(lerp(93, 245, ring.gold));
        const gg = Math.round(lerp(240, 194, ring.gold));
        const bb = Math.round(lerp(168, 107, ring.gold));
        ctx.strokeStyle = `rgba(${rr}, ${gg}, ${bb}, ${ring.alpha})`;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(0, 0, baseRingR * ring.scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Curved orbital light paths spanning the canvas
      ctx.save();
      ctx.lineWidth = 1;
      const curveOffset = Math.sin(smoothScroll * Math.PI * 2) * 90;
      const grad = ctx.createLinearGradient(0, height * 0.2, width, height * 0.85);
      grad.addColorStop(0, 'rgba(93, 240, 168, 0)');
      grad.addColorStop(0.5, `rgba(${Math.round(lerp(129, 245, goldPhase))}, ${Math.round(lerp(245, 194, goldPhase))}, ${Math.round(lerp(190, 107, goldPhase))}, 0.16)`);
      grad.addColorStop(1, 'rgba(116, 170, 255, 0)');
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-40, height * 0.72 + curveOffset * 0.4);
      ctx.bezierCurveTo(
        width * 0.32,
        height * 0.18 - curveOffset,
        width * 0.68,
        height * 0.92 + curveOffset,
        width + 40,
        height * 0.34 - curveOffset * 0.5
      );
      ctx.stroke();
      ctx.restore();

      // Floating dust motes
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        if (!reduceMotion) {
          d.x = (d.x + d.vx + 1) % 1;
          d.y = (d.y + d.vy + 1) % 1;
        }
        const px = d.x * width;
        const py = (((d.y - smoothScroll * d.depth * 0.32) % 1) + 1) % 1 * height;
        const color =
          d.tone === 'mint'
            ? 'rgba(129, 245, 190, 0.34)'
            : d.tone === 'gold'
            ? 'rgba(245, 194, 107, 0.28)'
            : 'rgba(148, 192, 255, 0.26)';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    if (reduceMotion) {
      drawFrame(performance.now());
      const onScrollStatic = () => drawFrame(performance.now());
      window.addEventListener('scroll', onScrollStatic, { passive: true });
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('scroll', updateScrollTarget);
        window.removeEventListener('scroll', onScrollStatic);
      };
    }

    rafId = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateScrollTarget);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
