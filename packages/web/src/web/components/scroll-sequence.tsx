import { useEffect, useRef } from 'react';
import { FragranceHero } from './fragrance-hero';

const COUNT = 50;
type Frame = ImageBitmap | HTMLImageElement;
const frameURL = (index: number, extension = 'webp') => `/frames/ezgif-frame-${String(index + 1).padStart(3, '0')}.${extension}`;

export function ScrollSequence() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const area = section.current;
    const surface = canvas.current;
    const ctx = surface?.getContext('2d', { alpha: false });
    if (!area || !surface || !ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const controller = new AbortController();
    const frames: (Frame | undefined)[] = Array.from({ length: COUNT });
    let disposed = false;
    let ready = false;
    let visible = true;
    let target = 0;
    let current = 0;
    let raf = 0;
    let lastTime = 0;
    let lastSignature = -1;
    let dirty = true;
    let width = 1;
    let height = 1;
    let top = 0;
    let travel = 1;
    let loaded = 0;
    let failed = 0;
    let next = 1;
    let loading = false;
    let drawWidth = 1;
    let drawHeight = 1;
    let drawX = 0;
    let drawY = 0;

    const updateTarget = () => {
      target = reduced.matches ? 0 : Math.max(0, Math.min(1, (scrollY - top) / travel)) * (COUNT - 1);
      surface.dataset.targetFrame = String(Math.round(target) + 1);
    };

    const resize = () => {
      const rect = surface.getBoundingClientRect();
      // Retina detail with a bounded 3MP pixel budget; allocation only on resize.
      const ratio = Math.min(devicePixelRatio || 1, 2, Math.sqrt(3_000_000 / Math.max(1, rect.width * rect.height)));
      width = Math.max(1, Math.round(rect.width * ratio));
      height = Math.max(1, Math.round(rect.height * ratio));
      if (surface.width !== width || surface.height !== height) {
        surface.width = width;
        surface.height = height;
        dirty = true;
      }
      top = area.getBoundingClientRect().top + scrollY;
      travel = Math.max(1, area.offsetHeight - rect.height);
      const scale = Math.max(width / 1920, height / 1080);
      drawWidth = 1920 * scale;
      drawHeight = 1080 * scale;
      drawX = (width - drawWidth) / 2;
      drawY = (height - drawHeight) / 2;
      updateTarget();
      start();
    };

    const render = () => {
      if (!frames[0]) return;
      const position = reduced.matches || !ready ? 0 : current;
      const lower = Math.floor(position);
      const upper = Math.min(COUNT - 1, lower + 1);
      // Quantized crossfade avoids spending a draw on imperceptible alpha changes.
      const alpha = Math.round((position - lower) * 120) / 120;
      const signature = lower * 121 + Math.round(alpha * 120);
      if (signature === lastSignature && !dirty) return;
      const first = frames[lower] || frames[0];
      const second = frames[upper] || first;
      ctx.globalAlpha = 1;
      ctx.drawImage(first, drawX, drawY, drawWidth, drawHeight);
      if (alpha > 0 && second !== first) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(second, drawX, drawY, drawWidth, drawHeight);
        ctx.globalAlpha = 1;
      }
      surface.dataset.currentFrame = String(Math.round(position) + 1);
      surface.dataset.renderedFrame = String(Math.round(position) + 1);
      dirty = false;
      lastSignature = signature;
    };

    function animate(time: number) {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      const elapsed = lastTime ? Math.min(48, time - lastTime) : 16.667;
      lastTime = time;
      const factor = 1 - Math.pow(1 - .08, elapsed / 16.667);
      if (ready) current += (target - current) * factor;
      if (Math.abs(target - current) < .005) current = target;
      render();
      // Keep a persistent loop while the scroll sequence is visible; no layout reads.
      if (!reduced.matches) raf = requestAnimationFrame(animate);
    }

    function start() {
      if (!disposed && visible && !document.hidden && !raf) {
        lastTime = 0;
        raf = requestAnimationFrame(animate);
      }
    }

    async function decode(index: number): Promise<Frame> {
      let response = await fetch(frameURL(index), { signal: controller.signal });
      if (!response.ok) response = await fetch(frameURL(index, 'png'), { signal: controller.signal });
      if (!response.ok) throw new Error(`Frame ${index + 1} unavailable`);
      const blob = await response.blob();
      if (typeof createImageBitmap === 'function') return createImageBitmap(blob);
      const image = new Image();
      const url = URL.createObjectURL(blob);
      try { image.src = url; await image.decode(); return image; }
      finally { URL.revokeObjectURL(url); }
    }

    async function load(index: number) {
      try {
        const image = await decode(index);
        if (disposed) { if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) image.close(); return; }
        frames[index] = image;
        loaded++;
        surface.dataset.loadedFrames = String(loaded);
        dirty = true;
        start();
      } catch {
        if (!disposed) failed++;
      }
    }

    async function preloadAll() {
      if (loading || disposed) return;
      loading = true;
      if (!frames[0]) await load(0);
      if (reduced.matches || disposed) { loading = false; return; }
      await Promise.all(Array.from({ length: 5 }, async () => {
        while (next < COUNT && !disposed) {
          const index = next++;
          await load(index);
        }
      }));
      if (disposed) return;
      // Never change frames during decoding. All images are drawable before playback.
      if (failed) {
        frames.forEach((image, index) => {
          if (!image) frames[index] = frames.slice(0, index).reverse().find(Boolean) || frames.find(Boolean);
        });
      }
      ready = frames.every(Boolean);
      surface.dataset.sequenceReady = String(ready);
      loading = false;
      start();
    }

    const onScroll = () => { updateTarget(); start(); };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else start();
    };
    const onPreference = () => { updateTarget(); dirty = true; void preloadAll(); start(); };
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    observer.observe(area);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { cancelAnimationFrame(raf); raf = 0; }
      else { updateTarget(); start(); }
    });
    intersection.observe(area);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    reduced.addEventListener('change', onPreference);
    resize();
    void preloadAll();

    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(raf);
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onPreference);
      const unique = new Set(frames);
      unique.forEach(image => { if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) image.close(); });
    };
  }, []);

  return (
    <section ref={section} className="sequence-scroll-area">
      <div className="sequence-pin" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
        <canvas ref={canvas} className="sequence-canvas" aria-hidden="true" />
        <FragranceHero />
      </div>
    </section>
  );
}