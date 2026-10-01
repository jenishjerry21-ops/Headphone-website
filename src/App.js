import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
gsap.registerPlugin(ScrollTrigger);
var products = [
    { id: '01', name: 'SUN / 01', color: 'Solar yellow', image: '/assets/headphones-yellow.png', tone: '#e7b900', className: 'yellow', note: 'A little more sunshine in every sound.' },
    { id: '02', name: 'TIDE / 02', color: 'Electric blue', image: '/assets/headphones-blue.png', tone: '#2458db', className: 'blue', note: 'Find your frequency. Leave the noise behind.' },
    { id: '03', name: 'PULSE / 03', color: 'Signal red', image: '/assets/headphones-red.png', tone: '#d82521', className: 'red', note: 'Turn up the feeling. Take it everywhere.' },
];
function App() {
    var root = useRef(null);
    var heroHeadphone = useRef(null);
    var heroTitle = useRef(null);
    useLayoutEffect(function () {
        var lenis = new Lenis({
            duration: 1.15,
            smoothWheel: true,
            wheelMultiplier: 0.85,
            touchMultiplier: 1.2,
            autoResize: true
        });
        lenis.on('scroll', ScrollTrigger.update);
        var tick = function (time) { return lenis.raf(time * 1000); };
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        // Ensure ScrollTrigger refreshes on resize
        var resizeObserver = new ResizeObserver(function () { return ScrollTrigger.refresh(); });
        resizeObserver.observe(document.body);
        // Add initial refresh delay to ensure DOM is ready
        setTimeout(function () { return ScrollTrigger.refresh(); }, 100);
        var heroMedia = gsap.matchMedia();
        var ctx = gsap.context(function () {
            gsap.from('.nav-inner > *', { y: -14, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out' });
            var intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
            intro.from('.hero-kicker, .hero-copy, .hero-cta', { y: 22, opacity: 0, duration: .8, stagger: .12 }, .18)
                .from(heroTitle.current, { y: 80, opacity: 0, duration: 1.05 }, .12)
                .from(heroHeadphone.current, { scale: .72, rotate: -13, y: 70, opacity: 0, duration: 1.25 }, .25);
            var createHeroTimeline = function (pin) {
                var heroTl = gsap.timeline({
                    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1, pin: pin }
                });
                heroTl.to(heroHeadphone.current, { y: -90, x: 65, rotate: 13, scale: .7, ease: 'none' }, 0)
                    .to(heroTitle.current, { xPercent: -18, letterSpacing: '-.1em', ease: 'none' }, 0);
            };
            heroMedia.add('(min-width: 768px)', function () { return createHeroTimeline(true); });
            heroMedia.add('(max-width: 767px)', function () { return createHeroTimeline(false); });
            gsap.from('.manifesto-word', {
                yPercent: 100, stagger: .12, ease: 'power3.out',
                scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'top 30%', scrub: 1 },
            });
            gsap.from('.feature-card', {
                y: 60, opacity: 0, stagger: .16, duration: .9, ease: 'power3.out',
                scrollTrigger: { trigger: '.features-grid', start: 'top 78%' },
            });
            gsap.utils.toArray('.product-panel').forEach(function (panel) {
                var img = panel.querySelector('.product-image');
                gsap.fromTo(img, { y: 75, rotate: -8, scale: .82 }, {
                    y: -24, rotate: 4, scale: 1, ease: 'none',
                    scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
                });
                gsap.from(panel.querySelector('.product-info'), {
                    y: 36, opacity: 0, duration: .8, ease: 'power3.out',
                    scrollTrigger: { trigger: panel, start: 'top 65%' },
                });
            });
            ScrollTrigger.refresh();
        }, root);
        return function () { ctx.revert(); heroMedia.revert(); gsap.ticker.remove(tick); lenis.destroy(); resizeObserver.disconnect(); };
    }, []);
    return <div ref={root}>
    <header className="nav"><div className="nav-inner">
      <a className="brand" href="#top" aria-label="Headphone Expo home"><span className="brand-mark">H</span><span>HEADPHONE<br />EXPO</span></a>
      <nav aria-label="Main navigation"><a href="#collection">COLLECTION</a><a href="#story">OUR SOUND</a><a href="#features">DETAILS</a></nav>
      <a className="nav-cta" href="#collection">EXPLORE <span>↗</span></a>
    </div></header>

    <main id="top">
      <section className="hero">
        <div className="hero-grain"/>
        <div className="hero-topline"><span>OBJECTS FOR LISTENING</span><span>ISSUE NO. 01&nbsp;&nbsp; / &nbsp;&nbsp;2025</span></div>
        <div className="hero-content">
          <div className="hero-copy"><p className="eyebrow hero-kicker"><i /> SOUND, IN FULL COLOR</p><p className="hero-intro">A closer listen.<br />A louder point of view.</p><a href="#collection" className="round-link hero-cta">DISCOVER THE COLLECTION <span>↘</span></a></div>
          <img ref={heroHeadphone} className="hero-headphone" src="/assets/headphones-yellow.png" alt="Yellow over-ear wireless headphones"/>
          <h1 ref={heroTitle}>HEAR<br /><em>YOUR</em><br />WORLD<span className="hero-dot">.</span></h1>
          <div className="hero-index"><span>01—03</span><span>SCROLL TO EXPLORE ↓</span></div>
        </div>
        <div className="hero-bottom"><span>ENGINEERED FOR YOUR EVERYDAY</span><span>35° 41' 22.2"N &nbsp; 139° 41' 30.1"E</span></div>
      </section>

      <section className="manifesto" id="story">
        <div className="section-meta"><span>01 / THE POINT OF LISTENING</span><span>LESS NOISE. MORE YOU.</span></div>
        <p className="manifesto-line"><span className="manifesto-word">Sound</span> <span className="manifesto-word">is</span><br /><span className="manifesto-word">a place</span> <span className="manifesto-word">to</span><br /><span className="manifesto-word accent-word">come alive<span>.</span></span></p>
        <div className="manifesto-bottom"><span className="tiny-cross">✳</span><p>Good sound doesn't ask for your attention.<br />It gives you a reason to give it.</p><span className="manifesto-side">MADE TO MOVE WITH YOU — SINCE 2025</span></div>
      </section>

      <section className="collection" id="collection">
        <div className="collection-header"><div><p className="eyebrow"><i /> THREE WAYS TO TUNE IN</p><h2>Meet your<br /><em>match.</em></h2></div><p className="collection-desc">One considered silhouette.<br />Three unmistakable ways<br />to make it yours.</p><span className="vertical-note">THE COLOR STUDY &nbsp;—&nbsp; 01 / 03</span></div>
        {products.map(function (product, index) { return <article className={"product-panel ".concat(product.className)} key={product.id} style={{ '--tone': product.tone }}>
          <div className="panel-number">{product.id}<span> / 03</span></div>
          <div className="product-backdrop"><span className="backdrop-word">{product.color.split(' ')[0].toUpperCase()}</span><span className="backdrop-ring"/></div>
          <img className="product-image" src={product.image} alt={"".concat(product.color, " over-ear headphones")}/>
          <div className="product-info"><p className="eyebrow">THE EXPO COLLECTION &nbsp;·&nbsp; {product.id}</p><h3>{product.name}</h3><p className="product-note">{product.note}</p><a className="text-link" href="#features">MEET THE DETAILS <span>↗</span></a></div>
          <div className="color-chip"><span />{product.color}</div>
          {index < products.length - 1 && <span className="panel-next">NEXT COLOR ↓</span>}
        </article>; })}
      </section>

      <section className="features" id="features">
        <div className="section-meta"><span>02 / MADE FOR THE MOMENT</span><span>THOUGHTFUL BY DESIGN</span></div>
        <div className="features-heading"><h2>All feeling.<br /><em>No fuss.</em></h2><p>Every detail has a job.<br />Nothing gets in the way.</p></div>
        <div className="features-grid">
          <article className="feature-card"><span className="feature-icon">◉</span><span className="feature-no">01 — FOCUS</span><h3>Find your<br />own frequency.</h3><p>Sink into the music, the moment, and the things you came here for.</p><span className="feature-line"/></article>
          <article className="feature-card"><span className="feature-icon">⌁</span><span className="feature-no">02 — COMFORT</span><h3>Hours feel<br />like minutes.</h3><p>Soft-touch cushions and a balanced fit that stays out of your way.</p><span className="feature-line"/></article>
          <article className="feature-card"><span className="feature-icon">↗</span><span className="feature-no">03 — FREEDOM</span><h3>Your sound.<br />Your everywhere.</h3><p>Easy to take along. Impossible to leave behind.</p><span className="feature-line"/></article>
        </div>
      </section>

      <section className="closing">
        <div className="closing-orbit orbit-one"/><div className="closing-orbit orbit-two"/>
        <p className="eyebrow"><i /> KEEP THE WORLD OUT. LET YOURS IN.</p>
        <h2>Make room<br />for <em>more.</em></h2>
        <a className="round-link closing-cta" href="#collection">FIND YOUR COLOR <span>↗</span></a>
        <div className="closing-mark">H</div>
      </section>
    </main>
    <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">H</span><span>HEADPHONE<br />EXPO</span></a><span>GOOD SOUND. GOOD COMPANY.</span><a href="#top">BACK TO TOP ↑</a><small>© 2025 HEADPHONE EXPO</small></footer>
  </div>;
}
export default App;
