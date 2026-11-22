import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  reduceMotion?: boolean;
}

export function ScrollReveal({
  children,
  className = '',
  delayMs = 0,
  reduceMotion = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      style={
        reduceMotion
          ? undefined
          : {
              transitionProperty: 'opacity, transform',
              transitionDuration: '700ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${delayMs}ms`,
            }
      }
      className={`${className} ${
        visible || reduceMotion
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-7'
      }`}
    >
      {children}
    </div>
  );
}
