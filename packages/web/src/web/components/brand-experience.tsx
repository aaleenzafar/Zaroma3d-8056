import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Droplets, Flower2, Wind, X, Plus, Minus } from 'lucide-react';
import './brand-experience.css';

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 30, filter: 'blur(5px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .15 }} transition={{ duration: .9, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function MagneticButton({ children, onClick, className = '' }: { children: ReactNode; onClick: () => void; className?: string }) {
  const reduced = useReducedMotion();
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .07}px, ${(event.clientY - rect.top - rect.height / 2) * .1}px)`;
  };
  return <button className={`z-link ${className}`} onClick={onClick} onPointerMove={move} onPointerLeave={event => { event.currentTarget.style.transform = ''; }}>{children}<ArrowUpRight size={18} strokeWidth={1} /></button>;
}

const journey = [
  { name: 'SPRAY', note: 'TOP NOTES', title: 'An immediate spark.', text: 'The first encounter. A luminous opening, a moment of anticipation. The ritual begins on skin.', image: '/images/iris-botanical.jpg', alt: 'Violet iris emerging from darkness', motif: 'spark' },
  { name: 'EVOLVE', note: 'HEART NOTES', title: 'A world in bloom.', text: 'Floral and earthy facets unfold slowly, revealing a softer, more intimate expression.', image: '/images/essence-botanical.jpg', alt: 'Sculptural purple botanical petals', motif: 'bloom' },
  { name: 'SETTLE', note: 'BASE NOTES', title: 'Depth, made personal.', text: 'Deep amber and woods form an enveloping foundation. A quiet warmth that feels entirely your own.', image: '/frames/ezgif-frame-033.webp', alt: 'Atmospheric violet forest from the Zaroma world', motif: 'woods' },
  { name: 'LEAVE A TRACE', note: '24H SILLAGE', title: 'Presence beyond the moment.', text: 'An invisible signature. A lingering memory. A trace that speaks long after you have gone.', image: '/images/zaroma-universe.png', alt: 'Botanical planet glowing in the violet cosmos', motif: 'trace' },
];

function OlfactoryRitual() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  useEffect(() => {
    const media = matchMedia('(min-width: 901px)');
    const update = () => {
      setDesktop(media.matches);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    const observer = new ResizeObserver(update);
    if (track.current) observer.observe(track.current);
    window.addEventListener('resize', update);
    media.addEventListener('change', update);
    update();
    return () => { observer.disconnect(); window.removeEventListener('resize', update); media.removeEventListener('change', update); };
  }, []);
  const horizontal = desktop && !reduced;
  return <section id="the-scents" ref={section} className={`z-ritual ${horizontal ? 'z-horizontal' : 'z-vertical'}`}>
    <div className="z-ritual-pin">
      <div className="z-ritual-heading"><span className="z-eyebrow">03 / THE OLFACTORY RITUAL</span><p>One scent. <i>Four chapters.</i></p><span className="z-scroll-hint">{horizontal ? 'SCROLL TO EXPLORE →' : 'A JOURNEY ON SKIN'}</span></div>
      <motion.div ref={track} className="z-ritual-track" style={horizontal ? { x } : undefined}>
        {journey.map((step, index) => <article className={`z-ritual-step z-${step.motif}`} key={step.name}>
          <div className="z-step-image"><img src={step.image} alt={step.alt} loading="lazy" /><span className="z-step-number">0{index + 1}</span><span className="z-image-caption">ZAROMA / A STUDY IN SCENT</span></div>
          <div className="z-step-copy"><span className="z-eyebrow">{step.note}</span><h3>{step.name}</h3><p className="z-step-poetry">{step.title}</p><p className="z-body">{step.text}</p></div>
        </article>)}
      </motion.div>
      {horizontal && <div className="z-ritual-progress"><motion.span style={{ scaleX: scrollYProgress }} /></div>}
    </div>
  </section>;
}

const policyCopy: Record<string, { heading: string; text: string }> = {
  JOURNAL: { heading: 'Notes from our world.', text: 'A future journal of botanical inspiration, rituals and the invisible art of fragrance. This editorial destination is a preview.' },
  CONTACT: { heading: 'A conversation, soon.', text: 'The contact experience is not connected yet. No message or personal information will be sent from this preview.' },
  FAQ: { heading: 'A few considered answers.', text: 'Midnight Sweet is shown as a 50 ml Eau de Parfum. This website is a design preview: products cannot yet be purchased, and campaign scent notes and sillage claims are supplied brand copy, not independently verified specifications.' },
  SHIPPING: { heading: 'From our world to yours.', text: 'Shipping destinations, delivery times and rates will be confirmed before the store launches. No shipping service is active in this preview.' },
  RETURNS: { heading: 'A considered experience.', text: 'The final returns policy will be provided before purchases become available. This preview does not accept orders or returns.' },
  PRIVACY: { heading: 'Your privacy, respected.', text: 'The newsletter form is a local interface preview. Submitting it does not send or store your email with a mailing service. A complete privacy policy will be published before launch.' },
  TERMS: { heading: 'A world in progress.', text: 'This site is a design preview, not a transactional storefront. Product availability, prices and final terms of sale are not yet published.' },
};

function PreviewDialog({ type, close }: { type: string; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  const shop = type === 'SHOP';
  const content = policyCopy[type];
  return <dialog ref={dialog} className="z-dialog" onCancel={close} aria-label={shop ? "Midnight Sweet store preview" : `${type} information preview`}>
    <div className="z-dialog-inner"><button className="z-dialog-close" onClick={close} aria-label="Close preview"><X size={22} strokeWidth={1} /></button><span className="z-eyebrow">{shop ? 'THE SIGNATURE / STORE PREVIEW' : `${type} / PREVIEW`}</span>
      {shop ? <><img className="z-dialog-bottle" src="/images/midnight-bottle.png" alt="Zaroma Midnight Sweet 50 ml Eau de Parfum bottle" /><h2>Midnight <i>Sweet.</i></h2><p className="z-eyebrow">50 ML EAU DE PARFUM</p><p className="z-body">Your next signature. Our store is not live yet—this is a product preview, not a checkout. No order or payment will be taken.</p></> : <><h2>{content.heading}</h2><p className="z-body">{content.text}</p></>}
      <button className="z-link" onClick={close}>CONTINUE EXPLORING <ArrowRight size={18} /></button>
    </div>
  </dialog>;
}

function LuxuryFooter({ open }: { open: (type: string) => void }) {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const links = [{ label: 'SHOP', target: '#signature' }, { label: 'THE SCENTS', target: '#the-scents' }, { label: 'OUR ESSENCE', target: '#essence' }];
  return <footer className="z-footer" id="contact">
    <div className="z-footer-top"><Reveal><p className="z-footer-quote">Leave a <i>trace.</i></p><span className="z-eyebrow">THE INVISIBLE. UNFORGETTABLE.</span></Reveal><div className="z-newsletter"><label className="z-eyebrow" htmlFor="z-email">ENTER THE ZAROMA WORLD</label><form onSubmit={event => { event.preventDefault(); setJoined(true); }}><input id="z-email" aria-label="Email address" type="email" value={email} onChange={event => { setEmail(event.target.value); setJoined(false); }} placeholder="Your email address" required autoComplete="email" /><button type="submit">JOIN <ArrowRight size={20} strokeWidth={1} /></button></form><output className="z-newsletter-note">{joined ? 'Preview received. You have not been subscribed; no email was sent or stored.' : 'A quieter kind of inspiration. Newsletter preview only.'}</output></div></div>
    <nav className="z-footer-links" aria-label="Footer navigation">{links.map(link => <a key={link.label} href={link.target}>{link.label}</a>)}{['JOURNAL', 'CONTACT'].map(label => <button key={label} onClick={() => open(label)}>{label}</button>)}</nav>
    <div className="z-footer-wordmark">ZAROMA<span>PARFUM HAUTE</span></div>
    <div className="z-footer-bottom"><span>© ZAROMA 2026</span><nav aria-label="Store information">{['FAQ', 'SHIPPING', 'RETURNS', 'PRIVACY', 'TERMS'].map(label => <button key={label} onClick={() => open(label)}>{label}</button>)}</nav><button onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })} aria-label="Back to top">BACK TO TOP ↑</button></div>
    <button className="z-preview-disclosure" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>DESIGN PREVIEW {expanded ? <Minus size={12} /> : <Plus size={12} />}</button>{expanded && <p className="z-disclosure-text">Commerce and newsletter are not connected. Botanical imagery and note descriptions express the campaign concept; confirm final ingredient and performance claims before launch.</p>}
  </footer>;
}

export function BrandExperience() {
  const [preview, setPreview] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const product = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: product, offset: ['start end', 'end start'] });
  const bottleY = useTransform(scrollYProgress, [0, 1], [32, -32]);
  const spotlight = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const panel = (event.target as HTMLElement).closest<HTMLElement>('.z-illuminated');
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    panel.style.setProperty('--light-x', `${event.clientX - rect.left}px`);
    panel.style.setProperty('--light-y', `${event.clientY - rect.top}px`);
  };
  return <div className="zaroma-continuation" ref={root} onPointerMove={spotlight}>
    <section id="essence" className="z-essence z-illuminated">
      <div className="z-section-top"><span className="z-eyebrow">01 / THE ESSENCE</span><span className="z-eyebrow z-faint">BOTANY MEETS THE BEYOND</span></div>
      <div className="z-essence-grid"><Reveal className="z-essence-visual"><div className="z-botanical-frame"><img src="/images/essence-botanical.jpg" alt="Deep violet botanical flower with sculptural petals" loading="lazy" /><div className="z-photo-orbit" /><span className="z-specimen-label">FIG. 01<br />THE BOTANICAL SIGNATURE</span></div><div className="z-essence-glass"><Flower2 size={22} strokeWidth={.8} /><span>ROOTED IN NATURE.<br />CREATED TO TRANSCEND.</span></div></Reveal>
      <div className="z-essence-copy"><Reveal><h2 className="z-display">MORE THAN<br />A <i>FRAGRANCE.</i></h2><p className="z-poetry">An invisible expression<br />of who you are.</p><p className="z-body">ZAROMA lives at the intersection of the botanical and the extraordinary. We see fragrance as more than something you wear. It is a feeling. A presence. A world you carry with you.</p><p className="z-body">Intentionally composed. Deeply sensorial. Made to become unmistakably yours.</p></Reveal><div className="z-essence-details">{[{ icon: Droplets, name: 'PURE EXTRACT', detail: 'The essence, distilled.' }, { icon: Wind, name: '24H SILLAGE', detail: 'A presence that lingers.' }, { icon: Flower2, name: 'SIGNATURE BOTANICAL SCENT', detail: 'Nature, reimagined.' }].map((item, index) => <Reveal delay={index * .1} key={item.name}><div className="z-detail-row"><item.icon size={22} strokeWidth={.8} /><span>{item.name}<small>{item.detail}</small></span><span className="z-detail-index">0{index + 1}</span></div></Reveal>)}</div></div></div>
      <div className="z-section-baseline"><span>PURE BY NATURE</span><span>UNFORGETTABLE BY DESIGN</span></div>
    </section>

    <section ref={product} id="signature" className="z-product z-illuminated">
      <div className="z-section-top"><span className="z-eyebrow">02 / THE SIGNATURE BOTTLE</span><span className="z-eyebrow z-faint">ONE SCENT. YOUR SIGNATURE.</span></div>
      <Reveal className="z-product-heading"><h2 className="z-display">THE SIGNATURE <i>RITUAL</i></h2><p className="z-body">A moment of midnight. An eternity of possibility.</p></Reveal>
      <div className="z-bottle-stage"><div className="z-bottle-halo" /><div className="z-orbit z-orbit-one" /><div className="z-orbit z-orbit-two" /><span className="z-product-side">ZAROMA / MIDNIGHT SWEET</span>
        <motion.div className="z-bottle-parallax" style={reduced ? undefined : { y: bottleY }}><img className="z-main-bottle" src="/images/midnight-bottle.png" alt="Actual Zaroma Midnight Sweet bottle with gold cap and blue glass, labeled EDP 50 ml" loading="lazy" /></motion.div>
        <Reveal className="z-floating-detail z-detail-a"><span>THE COMPOSITION</span><strong>50 ML</strong><small>EAU DE PARFUM</small></Reveal><Reveal className="z-floating-detail z-detail-b" delay={.15}><span>THE PRESENCE</span><Wind size={24} strokeWidth={.8} /><small>LONG-LASTING<br />24H SILLAGE</small></Reveal><Reveal className="z-floating-detail z-detail-c" delay={.2}><span>THE FEELING</span><strong>WEIGHTLESS</strong><small>ELEGANCE</small></Reveal><Reveal className="z-floating-detail z-detail-d" delay={.3}><span>THE MOMENT</span><strong>ALWAYS</strong><small>FOR ALL OCCASIONS</small></Reveal>
      </div><Reveal className="z-product-bottom"><div><span className="z-eyebrow">YOUR SIGNATURE, AFTER DARK</span><h3>Midnight <i>Sweet.</i></h3></div><MagneticButton onClick={() => setPreview('SHOP')}>SHOP SIGNATURE PERFUME</MagneticButton><span className="z-store-note">50 ML EDP / STORE PREVIEW</span></Reveal>
    </section>

    <OlfactoryRitual />

    <section id="world" className="z-world z-illuminated"><img className="z-world-planet" src="/images/zaroma-universe.png" alt="A luminous botanical planet in a violet cosmos" loading="lazy" /><div className="z-world-shade" /><div className="z-world-stars" aria-hidden="true" /><div className="z-section-top"><span className="z-eyebrow">04 / THE ZAROMA WORLD</span><span className="z-eyebrow z-faint">BEYOND THE VISIBLE</span></div>
      <Reveal className="z-world-copy"><span className="z-eyebrow">NATURE IS OUR BEGINNING. NOT OUR LIMIT.</span><h2 className="z-display">ENTER THE WORLD<br />OF <i>ZAROMA</i></h2><p className="z-body">Some worlds are not seen. They are felt.<br />Follow a scent beyond the ordinary—into a universe<br className="z-desktop-break" /> of botanical wonder and infinite possibility.</p><MagneticButton onClick={() => document.getElementById('z-email')?.focus()}>DISCOVER ZAROMA</MagneticButton></Reveal>
      <div className="z-world-values">{['BOTANICAL', 'INTENTIONAL', 'SENSORIAL'].map((word, index) => <Reveal delay={index * .12} key={word}><span>0{index + 1}</span><p>{word}</p></Reveal>)}</div>
    </section>
    <LuxuryFooter open={setPreview} />
    {preview && <PreviewDialog type={preview} close={() => setPreview(null)} />}
  </div>;
}