# ZAROMA — cinematic fragrance

Existing hero UI preserved without restyling. A 400svh scroll section pins the original full-screen hero, with a DPR-aware HTML5 canvas behind all content. Fifty supplied Lunae frames progressively preload and crossfade using a persistent requestAnimationFrame loop easing toward scroll progress. Framer Motion tracks scroll; native geometry recalculation ensures updates after scroll and resize. Reduced motion shows frame 001 without animation. Black fallback matches the supplied frame edges. Original standalone PNG remains stored but is not rendered. Parallax affects foreground only.

Locally hosted Michroma with a synthesized bold treatment for the two headline lines and subtitle; Manrope remains on navigation, logo, and benefits. The text block is moved 34% closer to the top: desktop top 12.21%, wide-screen 12.54%, mobile 14.52%. Silver #f2edf9, muted lavender #c6bbd5, hairline translucent borders, violet hover glow.

Top navigation at 5% inset; centered logo; two-line headline in upper third; vertical side labels; rounded four-part glass benefit bar at bottom. Central SHOP NOW CTA and circular Z monogram removed at user request. Mobile retains the remaining content with a 2-by-2 benefit layout.

Staggered foreground reveals, maximum 3px parallax, reduced-motion support. Menu toggles a minimal glass overlay. Shop buttons focus and softly highlight fragrance benefits, with no invented products or checkout.

Web package only. No new API or database features.

## Continuation — approved

Preserve the hero component and original global stylesheet exactly. Optimize the sequence internals with decoded bitmap caching, WebP delivery copies, 0.08 frame-rate-independent easing, bounded preload concurrency, offscreen suspension, and capped retina backing size. Canvas acceleration is non-layout-affecting.

Append a scoped `.zaroma-continuation` surface: near-black/midnight #06050a, silver #f2edf9, muted lavender #a79bb8, restrained violet illumination. Cormorant Garamond light/italic editorial display paired with Michroma section indices and Manrope readable body copy. Large asymmetric photographic fields, hairline rules, generous whitespace, no standard product grids.

Essence: botanical macro left, large typographic philosophy right, three restrained detail rows. Signature: actual Midnight Sweet bottle, 50 ML EAU DE PARFUM, orbital fine lines and floating glass details; preview-only shop modal. Ritual: four oversized numbered panels moving horizontally in a desktop sticky area, vertical mobile/reduced-motion sequence. World: cosmic planet and botanical fragments with a three-word manifesto. Footer: large ZAROMA wordmark, editorial quote, section anchors, preview information dialogs and newsletter form with honest non-subscription confirmation.

All new motion respects reduced-motion. Motion transforms/opacity only; avoid continuous full-screen blur animation. Reveal via viewport intersection, pointer-position CSS spotlight on capable devices, gentle magnetic links and bottle tilt. Uploaded product label and color remain intact; photographic crop isolates the existing bottle, not a generated replacement. 24H/scent copy represents the supplied campaign brief rather than independently verified testing.