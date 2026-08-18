'use client';

import { useEffect, useRef, useState } from 'react';

/** Déclenche `inView` une seule fois quand l'élément entre dans le viewport. */
export function useInViewport<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/**
 * Enveloppe un bloc pour l'animer en fondu/translation quand il entre dans
 * le viewport (contrairement à une animation au chargement, ceci se
 * déclenche vraiment au scroll). `delay` échelonne plusieurs `<Reveal>`
 * dans une même section (0, 1 ou 2).
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | 1 | 2;
}) {
  const { ref, inView } = useInViewport<HTMLDivElement>();
  const riseClass = delay === 1 ? 'rise-2' : delay === 2 ? 'rise-3' : 'rise';

  return (
    <div ref={ref} className={`${className} ${inView ? riseClass : 'opacity-0'}`}>
      {children}
    </div>
  );
}
