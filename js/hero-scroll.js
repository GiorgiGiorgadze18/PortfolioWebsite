import {clampProgress, registerScrollMotion} from './scroll-motion.js';

const hero = document.querySelector('#hero');
const curtain = document.querySelector('#disciplines');
const pair = hero?.parentElement;
const root = document.documentElement;
const heroProperties = [
  '--hero-sticky-top', '--hero-scroll-transform', '--hero-scroll-opacity', '--hero-scroll-filter',
  '--hero-photo-offset', '--hero-text-offset', '--hero-parallax-compensation',
];

if (hero && curtain && pair?.classList.contains('hero-scroll-pair')) {
  let progress = null;
  let topInset = 0, overlap = 0, parallaxCompensation = 0;

  registerScrollMotion({
    enable(enabled) {
      root.classList.toggle('hero-scroll-enabled', enabled);
      progress = null;
      if (!enabled) {
        heroProperties.forEach(property => hero.style.removeProperty(property));
        curtain.style.removeProperty('--hero-overlap');
      }
    },
    update({height, lerp}) {
      const bounds = pair.getBoundingClientRect();
      const heroHeight = hero.getBoundingClientRect().height;
      const curtainBounds = curtain.getBoundingClientRect();
      // On short screens let the full hero scroll into view before it pins.
      topInset = Math.min(0, height - heroHeight);
      const heroBottom = Math.min(bounds.bottom, Math.max(bounds.top, topInset) + heroHeight);
      overlap = Math.max(0, heroBottom - curtainBounds.top);
      // Keep the existing parallax offset tied to how far the sticky hero has actually moved.
      parallaxCompensation = -.4 * Math.max(0, heroBottom - heroHeight - bounds.top);

      // A sticky element's own top stops moving. Read its normal-flow wrapper instead.
      const target = clampProgress((topInset - bounds.top) / (height * .85));
      progress = lerp(progress, target, .12);
      return progress !== target;
    },
    paint() {
      hero.style.setProperty('--hero-sticky-top', `${topInset}px`);
      hero.style.setProperty('--hero-scroll-transform', progress ?
        `translate3d(0, ${(-45 * progress).toFixed(2)}px, 0) scale(${(1 - .10 * progress).toFixed(4)})` : 'none');
      hero.style.setProperty('--hero-scroll-opacity', (1 - .88 * progress).toFixed(3));
      hero.style.setProperty('--hero-scroll-filter', progress ? `blur(${(4 * progress).toFixed(2)}px)` : 'none');
      hero.style.setProperty('--hero-photo-offset', `${(-8 * progress).toFixed(2)}px`);
      hero.style.setProperty('--hero-text-offset', `${(5 * progress).toFixed(2)}px`);
      hero.style.setProperty('--hero-parallax-compensation', `${parallaxCompensation.toFixed(2)}px`);
      curtain.style.setProperty('--hero-overlap', `${overlap.toFixed(2)}px`);
    },
  }, pair, hero);
}
