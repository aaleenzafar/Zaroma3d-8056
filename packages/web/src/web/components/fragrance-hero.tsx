import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Plus, X, Droplets, Wind, Flower2, Eclipse } from 'lucide-react';

const benefits = [
  { first: 'PURE', second: 'EXTRACT', icon: Droplets },
  { first: 'ENHANCES', second: 'SILLAGE', icon: Wind },
  { first: 'SIGNATURE', second: 'FRAGRANCE', icon: Flower2 },
  { first: 'FOR ALL', second: 'OCCASIONS', icon: Eclipse },
];

export function FragranceHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [indulging, setIndulging] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const benefitBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const indulge = () => {
    setMenuOpen(false);
    setIndulging(true);
    benefitBar.current?.focus({ preventScroll: true });
    window.setTimeout(() => setIndulging(false), 2200);
  };

  return (
    <main ref={hero} className="fragrance-hero" onPointerMove={(event) => {
      if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      hero.current?.style.setProperty('--drift-x', `${(event.clientX / window.innerWidth - .5) * 6}px`);
      hero.current?.style.setProperty('--drift-y', `${(event.clientY / window.innerHeight - .5) * 6}px`);
    }} onPointerLeave={() => {
      hero.current?.style.setProperty('--drift-x', '0px');
      hero.current?.style.setProperty('--drift-y', '0px');
    }}>
      <header className="navigation reveal">
        <button className="nav-control menu-control" aria-expanded={menuOpen} aria-controls="brand-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="circle-control">{menuOpen ? <X size={17} strokeWidth={1} /> : <span className="menu-lines"><i /><i /></span>}</span>
          <span>MENU</span>
        </button>
        <a href="/" className="brand" aria-label="Zaroma home"><span>ZAROMA</span><small>PARFUM HAUTE</small></a>
        <button className="nav-control shop-control" onClick={indulge}><span>SHOP PERFUME</span><span className="circle-control"><Plus size={19} strokeWidth={1} /></span></button>
      </header>

      <div className="headline-position foreground">
        <div className="headline reveal"><h1><span>LUXURY</span><span>IN EVERY NOTE</span></h1><p>SIGNATURE FRAGRANCE PARFUM</p></div>
      </div>

      <button className="edge-label edge-left reveal" onClick={() => benefitBar.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' })}><span className="edge-line" />SCROLL TO INDULGE<span className="edge-arrow">↓</span></button>
      <p className="edge-label edge-right reveal">NOURISH · SCENT · ENCHANT</p>

      <div ref={benefitBar} tabIndex={-1} className={`benefit-bar reveal ${indulging ? 'is-indulging' : ''}`} aria-label="Signature fragrance benefits">
        {benefits.map(({ first, second, icon: Icon }) => <div className="benefit" key={first}><Icon className="benefit-icon" strokeWidth={.8} /><p><span>{first}</span><span>{second}</span></p></div>)}
      </div>

      {menuOpen && <nav id="brand-menu" className="brand-menu" aria-label="Brand navigation"><button onClick={indulge}>SHOP PERFUME <ArrowRight size={18} strokeWidth={1} /></button><button onClick={indulge}>SIGNATURE FRAGRANCE <ArrowRight size={18} strokeWidth={1} /></button></nav>}
    </main>
  );
}