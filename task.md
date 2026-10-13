# ZAROMA continuation

- Approved: finish four sections + footer, preview-only commerce/newsletter. Midnight Sweet, 50 ML EAU DE PARFUM.
- Preserve hero component and original stylesheet byte-for-byte; change sequence renderer internals only, add acceleration without layout changes.
- Existing assets: actual bottle cutout/original, botanical flower and iris, cosmic planet, 50 sequence PNGs; serif fonts already downloaded.
- Performance: lightweight WebP copies for delivery, bounded concurrent decode, predecoded ImageBitmap cache, wait for complete sequence before animation, frame-rate-independent 0.08 lerp, no per-tick preload work/layout reads, draw only changed blends, pause offscreen/hidden, capped retina pixel budget.
- New frontend only: scoped continuation stylesheet, editorial sections, horizontal ritual, responsive footer, accessible preview modal and newsletter confirmation. No APIs/payment/newsletter service.
- Verify build/lint, desktop/mobile all sections, scroll 001→050→001, reduced motion, modal and newsletter, unchanged hero hashes, public preview.

## Completed 2026-10-12
- Four sections and spacious footer appended; real Midnight Sweet 50ML bottle used. Shop/information dialogs and local newsletter confirmation verified.
- Original hero component + global stylesheet hashes unchanged. Renderer updated independently; 50 WebP files total 5.12MB versus 82.7MB archive, originals retained. Decoded bitmap preload, 0.08 easing, no RAF layout/preload churn, offscreen suspension, 3MP backing buffer and 2x mobile DPR cap.
- Desktop 001→013→026→050→026→001, sticky coordinates, horizontal ritual final panel, mobile vertical layout and no page overflow, reduced-motion single frame and vertical ritual all verified. No browser page errors.
- Build and lint pass; build has advisory >500KB bundle warning. Public preview responds HTTP 200.
- Headless software-rendered 2x-DPR sample before 3MP cap averaged 32.9ms RAF, so no universal 60fps / Apple-level guarantee. Final pixel cap tested at 2,999,479 pixels and reaches frame 050.