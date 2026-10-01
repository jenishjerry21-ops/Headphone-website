import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const products = [
  { id: '01', name: 'SUN / 01', color: 'Solar yellow', image: '/assets/headphones-yellow.png', tone: '#e7b900', className: 'yellow', note: 'A little more sunshine in every sound.' },
  { id: '02', name: 'TIDE / 02', color: 'Electric blue', image: '/assets/headphones-blue.png', tone: '#2458db', className: 'blue', note: 'Find your frequency. Leave the noise behind.' },
  { id: '03', name: 'PULSE / 03', color: 'Signal red', image: '/assets/headphones-red.png', tone: '#d82521', className: 'red', note: 'Turn up the feeling. Take it everywhere.' },
];

function App() {
  const root = useRef<HTMLDivElement>(null);
  const heroHeadphone = useRef<HTMLImageElement>(null);
  const heroHeadphoneScroll = useRef<HTMLDivElement>(null);
  const heroHeadphoneSecondary = useRef<HTMLImageElement>(null);
  const heroHandoff = useRef<HTMLImageElement>(null);
  const heroTitle = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = prefersReducedMotion ? null : new Lenis({
      duration: 0.9,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      autoResize: true,
    });
    const updateScroll = () => ScrollTrigger.update();
    const handleAnchorClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute('href');
      const target = href && href.length > 1 ? document.getElementById(decodeURIComponent(href.slice(1))) : null;
      if (!lenis || !href || !target) return;
      event.preventDefault();
      if (window.location.hash !== href) window.history.pushState(null, '', href);
      lenis.scrollTo(target);
    };
    lenis?.on('scroll', updateScroll);
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (lenis) gsap.ticker.add(tick);
    root.current?.addEventListener('click', handleAnchorClick);

    let active = true;
    let refreshFrame = 0;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        if (active) ScrollTrigger.refresh();
      });
    };
    window.addEventListener('load', refresh, { once: true });
    void document.fonts.ready.then(refresh);

    const heroMedia = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const createHeroTimeline = (pin: boolean) => {
        const heroTl = gsap.timeline({
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1, pin }
        });
        heroTl.to(heroHeadphoneScroll.current, {
          y: 90, x: 65, rotate: 13, ease: 'none',
        }, 0)
          .to(heroHeadphoneSecondary.current, {
            y: -90, x: 65, rotate: 13, ease: 'none',
          }, 0)
          .to(heroTitle.current, { xPercent: -18, letterSpacing: '-.1em', ease: 'none' }, 0);
      };
      if (!prefersReducedMotion) {
        gsap.from('.nav-inner > *', { y: -14, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out' });
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro.from('.hero-copy', { y: 22, opacity: 0, duration: .8 }, .18)
          .from(heroTitle.current, { y: 80, opacity: 0, duration: 1.05 }, .12)
          .from(heroHeadphone.current, { scale: .72, rotate: -13, y: 70, opacity: 0, duration: 1.25 }, .25);

        heroMedia.add('(min-width: 768px) and (hover: hover)', () => createHeroTimeline(true));
        heroMedia.add('(max-width: 767.98px), (hover: none)', () => createHeroTimeline(false));
        const firstProductImage = root.current?.querySelector<HTMLImageElement>('.product-panel.yellow .product-image');
        if (heroHeadphone.current && heroHeadphoneScroll.current && heroHandoff.current && firstProductImage) {
          const sourceBounds = () => heroHeadphone.current!.getBoundingClientRect();
          const targetBounds = () => firstProductImage.getBoundingClientRect();
          const sourceWidth = () => heroHeadphone.current!.offsetWidth;
          const sourceHeight = () => heroHeadphone.current!.offsetHeight;
          const targetScale = () => firstProductImage.offsetWidth / sourceWidth();
          gsap.set(firstProductImage, { autoAlpha: 0, scale: .94 });
          gsap.set(heroHandoff.current, {
            width: sourceWidth(),
            transformOrigin: 'top left',
            autoAlpha: 0,
          });

          const handoff = gsap.timeline({
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: () => {
                const image = targetBounds();
                const targetScroll = window.scrollY + image.top + image.height / 2 - window.innerHeight * .68;
                return `+=${Math.max(1, targetScroll)}`;
              },
              scrub: true,
              invalidateOnRefresh: true,
              onRefresh: () => gsap.set(heroHandoff.current, { width: sourceWidth() }),
            },
          });
          handoff.fromTo(heroHandoff.current, {
            x: () => sourceBounds().left,
            y: () => sourceBounds().top,
            scale: 1,
          }, {
            x: () => targetBounds().left + targetBounds().width / 2 - sourceWidth() * targetScale() / 2,
            y: () => window.innerHeight * .68 - sourceHeight() * targetScale() / 2,
            scale: targetScale,
            duration: 1,
            ease: 'none',
          }, 0);
          handoff.to(heroHeadphoneScroll.current, { autoAlpha: 0, duration: .035, ease: 'none' }, 0);
          handoff.to(heroHandoff.current, { autoAlpha: 1, duration: .035, ease: 'none' }, 0);
          handoff.to(heroHandoff.current, { autoAlpha: 0, duration: .04, ease: 'none' }, .96);
          handoff.to(firstProductImage, { autoAlpha: 1, scale: 1, duration: .04, ease: 'none' }, .96);
        }
        gsap.from('.manifesto-word', {
          yPercent: 100, stagger: .12, ease: 'power3.out',
          scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'top 30%', scrub: 1 },
        });
        gsap.from('.collection-header', {
          y: 28, opacity: 0, duration: .8, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '.collection-header', start: 'top 78%', once: true },
        });
        gsap.from('.feature-card', {
          y: 60, opacity: 0, stagger: .16, duration: .9, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '.features-grid', start: 'top 78%' },
        });
        gsap.utils.toArray<HTMLElement>('.product-panel').forEach((panel, index) => {
          const image = panel.querySelector('.product-image');
          if (index > 0) {
            gsap.fromTo(image, {
              autoAlpha: 0, scale: .94,
            }, {
              autoAlpha: 1, scale: 1, duration: .9, delay: index * .06,
              ease: 'power3.out', immediateRender: false,
              scrollTrigger: { trigger: panel, start: 'top 82%', once: true },
            });
          }
          gsap.fromTo(image, { y: 18, rotate: -2 }, {
            y: -18, rotate: 2, ease: 'none', immediateRender: false,
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
          gsap.from(panel.querySelector('.backdrop-word'), {
            scale: .94, opacity: 0, duration: 1, ease: 'power2.out', immediateRender: false,
            scrollTrigger: { trigger: panel, start: 'top 72%', once: true },
          });
          gsap.from(panel.querySelector('.product-info'), {
            y: 36, opacity: 0, duration: .8, ease: 'power3.out', immediateRender: false,
            scrollTrigger: { trigger: panel, start: 'top 65%' },
          });
        });
        gsap.timeline({
          scrollTrigger: { trigger: '.closing', start: 'top 75%', once: true },
        })
          .from('.closing .eyebrow', { y: 16, opacity: 0, duration: .55, ease: 'power3.out' })
          .from('.closing h2', { y: 28, opacity: 0, duration: .7, ease: 'power3.out' }, .08)
          .from('.closing-cta', { y: 12, opacity: 0, duration: .5, ease: 'power3.out' }, .22);
      }
      refresh();
    }, root);

    return () => {
      active = false;
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener('load', refresh);
      root.current?.removeEventListener('click', handleAnchorClick);
      ctx.revert();
      heroMedia.revert();
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.off('scroll', updateScroll);
        lenis.destroy();
      }
    };
  }, []);

  return <div ref={root}>
    <header className="nav"><div className="nav-inner">
      <a className="brand" href="#top" aria-label="Headphone Expo home"><span className="brand-mark">H</span><span>HEADPHONE<br/>EXPO</span></a>
      <nav aria-label="Main navigation"><a href="#collection">COLLECTION</a><a href="#story">OUR SOUND</a><a href="#features">DETAILS</a></nav>
      <a className="nav-cta" href="#collection">EXPLORE <span>↗</span></a>
    </div></header>

    <main id="top">
      <section className="hero">
        <div className="hero-grain" />
        <div className="hero-topline"><span>OBJECTS FOR LISTENING</span><span>ISSUE NO. 01&nbsp;&nbsp; / &nbsp;&nbsp;2025</span></div>
        <div className="hero-content">
          <div className="hero-copy"><p className="eyebrow hero-kicker"><i /> SOUND, IN FULL COLOR</p><p className="hero-intro">A closer listen.<br/>A louder point of view.</p><a href="#collection" className="round-link hero-cta">DISCOVER THE COLLECTION <span>↘</span></a></div>
          <div className="hero-headphone-motion"><div ref={heroHeadphoneScroll}><img ref={heroHeadphone} className="hero-headphone" src="/assets/headphones-yellow.png" alt="Yellow over-ear wireless headphones" /></div></div>
          <div className="hero-headphone-secondary-motion"><img ref={heroHeadphoneSecondary} className="hero-headphone hero-headphone-secondary" src="/assets/headphones-blue.png" alt="Blue over-ear wireless headphones" /></div>
          <h1 ref={heroTitle}>HEAR<br/><em>YOUR</em><br/>WORLD<span className="hero-dot">.</span></h1>
          <div className="hero-index"><span>01—03</span><span>SCROLL TO EXPLORE ↓</span></div>
        </div>
        <div className="hero-bottom"><span>ENGINEERED FOR YOUR EVERYDAY</span><span>35° 41' 22.2"N &nbsp; 139° 41' 30.1"E</span></div>
      </section>

      <section className="manifesto" id="story">
        <div className="section-meta"><span>01 / THE POINT OF LISTENING</span><span>LESS NOISE. MORE YOU.</span></div>
        <p className="manifesto-line"><span className="manifesto-word">Sound</span> <span className="manifesto-word">is</span><br/><span className="manifesto-word">a place</span> <span className="manifesto-word">to</span><br/><span className="manifesto-word accent-word">come alive<span>.</span></span></p>
        <div className="manifesto-bottom"><span className="tiny-cross">✳</span><p>Good sound doesn't ask for your attention.<br/>It gives you a reason to give it.</p><span className="manifesto-side">MADE TO MOVE WITH YOU — SINCE 2025</span></div>
      </section>

      <section className="collection" id="collection">
        <div className="collection-header"><div><p className="eyebrow"><i /> THREE WAYS TO TUNE IN</p><h2>Meet your<br/><em>match.</em></h2></div><p className="collection-desc">One considered silhouette.<br/>Three unmistakable ways<br/>to make it yours.</p><span className="vertical-note">THE COLOR STUDY &nbsp;—&nbsp; 01 / 03</span></div>
        {products.map((product, index) => <article className={`product-panel ${product.className}`} key={product.id} style={{ '--tone': product.tone } as React.CSSProperties}>
          <div className="panel-number">{product.id}<span> / 03</span></div>
          <div className="product-backdrop"><span className="backdrop-word">{product.color.split(' ')[0].toUpperCase()}</span><span className="backdrop-ring" /></div>
          <img className="product-image" src={product.image} alt={`${product.color} over-ear headphones`} />
          <div className="product-info"><p className="eyebrow">THE EXPO COLLECTION &nbsp;·&nbsp; {product.id}</p><h3>{product.name}</h3><p className="product-note">{product.note}</p><a className="text-link" href="#features">MEET THE DETAILS <span>↗</span></a></div>
          <div className="color-chip"><span />{product.color}</div>
          {index < products.length - 1 && <span className="panel-next">NEXT COLOR ↓</span>}
        </article>)}
      </section>

      <section className="features" id="features">
        <div className="section-meta"><span>02 / MADE FOR THE MOMENT</span><span>THOUGHTFUL BY DESIGN</span></div>
        <div className="features-heading"><h2>All feeling.<br/><em>No fuss.</em></h2><p>Every detail has a job.<br/>Nothing gets in the way.</p></div>
        <div className="features-grid">
          <article className="feature-card"><span className="feature-icon">◉</span><span className="feature-no">01 — FOCUS</span><h3>Find your<br/>own frequency.</h3><p>Sink into the music, the moment, and the things you came here for.</p><span className="feature-line" /></article>
          <article className="feature-card"><span className="feature-icon">⌁</span><span className="feature-no">02 — COMFORT</span><h3>Hours feel<br/>like minutes.</h3><p>Soft-touch cushions and a balanced fit that stays out of your way.</p><span className="feature-line" /></article>
          <article className="feature-card"><span className="feature-icon">↗</span><span className="feature-no">03 — FREEDOM</span><h3>Your sound.<br/>Your everywhere.</h3><p>Easy to take along. Impossible to leave behind.</p><span className="feature-line" /></article>
        </div>
      </section>

      <section className="closing">
        <div className="closing-orbit orbit-one"/><div className="closing-orbit orbit-two"/>
        <p className="eyebrow"><i /> KEEP THE WORLD OUT. LET YOURS IN.</p>
        <h2>Make room<br/>for <em>more.</em></h2>
        <a className="round-link closing-cta" href="#collection">FIND YOUR COLOR <span>↗</span></a>
        <div className="closing-mark">H</div>
      </section>
    </main>
    <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">H</span><span>HEADPHONE<br/>EXPO</span></a><span>GOOD SOUND. GOOD COMPANY.</span><a href="#top">BACK TO TOP ↑</a><small>© 2025 HEADPHONE EXPO</small></footer>
    <img ref={heroHandoff} className="hero-handoff-image" src="/assets/headphones-yellow.png" alt="" aria-hidden="true" />
  </div>;
}

export default App;

