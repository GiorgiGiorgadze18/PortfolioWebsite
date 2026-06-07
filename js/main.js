/**
 * ================================================================
 *  GIORGI GIORGADZE PORTFOLIO — main.js
 * ================================================================
 *  1. Navbar   — scroll glass effect + mobile hamburger
 *  2. Parallax — scroll (40% speed) + subtle mouse offset
 *  3. Observer — entrance animations via Intersection Observer
 *  4. Filter   — category filter tabs on projects.html
 *  5. Nav link — auto-mark active page link
 *  6. Glow     — soft cursor radial glow (desktop only)
 *  7. Anchors  — smooth-scroll for #hash links
 * ================================================================
 */

'use strict';

/* ── Helpers ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ════════════════════════════════════════════════════════════════
   1. NAVBAR
   ════════════════════════════════════════════════════════════════ */

const navbar     = $('#navbar');
const hamburger  = $('#hamburger');
const mobileMenu = $('#mobile-menu');

function onScroll() {
  navbar?.classList.toggle('is-scrolled', window.scrollY > 20);
}

function toggleMenu() {
  if (!hamburger || !mobileMenu) return;
  const isOpen = hamburger.classList.toggle('is-open');
  mobileMenu.classList.toggle('is-open', isOpen);
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

window.addEventListener('scroll', onScroll, { passive: true });
hamburger?.addEventListener('click', toggleMenu);
mobileMenu?.addEventListener('click', (e) => { if (e.target === mobileMenu) closeMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
$$('.nav-link', mobileMenu ?? document).forEach(l => l.addEventListener('click', closeMenu));


/* ════════════════════════════════════════════════════════════════
   2. PARALLAX BACKGROUND
   Moves at 40% of scroll speed so it lags behind the foreground.
   Mouse-move on the hero adds a subtle ±10px xy offset.

   TO USE A REAL BACKGROUND IMAGE:
     In css/style.css → .parallax-bg, uncomment:
       background-image: url('../assets/hero-bg.jpg');
       background-size: cover;
       background-position: center;
     The element's inset:-20% gives room to move without edge gaps.
   ════════════════════════════════════════════════════════════════ */

const parallaxEl  = $('#parallax-bg');
const heroSection = $('#hero');
let   mx = 0, my = 0; // mouse offsets

function applyParallax() {
  if (!parallaxEl) return;
  const sy = window.scrollY * 0.40;
  parallaxEl.style.transform = `translate(${mx}px, ${sy + my}px)`;
}

if (parallaxEl) {
  window.addEventListener('scroll', applyParallax, { passive: true });

  heroSection?.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = heroSection.getBoundingClientRect();
    const amp = 10;
    mx = ((e.clientX - left - width  / 2) / (width  / 2)) * amp;
    my = ((e.clientY - top  - height / 2) / (height / 2)) * amp;
    applyParallax();
  });

  heroSection?.addEventListener('mouseleave', () => {
    mx = my = 0;
    applyParallax();
  });
}


/* ════════════════════════════════════════════════════════════════
   3. INTERSECTION OBSERVER — ENTRANCE ANIMATIONS
   Elements with [data-animate] start hidden (CSS: opacity:0,
   translateY:26px). Observer adds .is-visible when they enter
   the viewport, triggering the CSS transition.
   [data-delay="N"] → transition-delay = N × 0.13s (stagger).
   Hero elements animate immediately (above fold, no scroll).
   ════════════════════════════════════════════════════════════════ */

const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        animObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.10, rootMargin: '0px 0px -50px 0px' }
);

$$('[data-animate]').forEach((el) => {
  const d = el.getAttribute('data-delay');
  if (d) el.style.transitionDelay = `${parseInt(d, 10) * 0.13}s`;
  animObserver.observe(el);
});

/* Trigger above-fold elements without waiting for scroll */
function kickAboveFold(scope) {
  if (!scope) return;
  $$('[data-animate]', scope).forEach((el, i) => {
    setTimeout(() => el.classList.add('is-visible'), 80 + i * 140);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    kickAboveFold(heroSection || $('.projects-page-hero'));
  });
} else {
  kickAboveFold(heroSection || $('.projects-page-hero'));
}


/* ════════════════════════════════════════════════════════════════
   4. PROJECT FILTER (projects.html)
   Clicking a .filter-btn[data-filter] toggles .is-hidden on
   non-matching .project-card[data-category] elements.
   CSS handles the opacity + scale transition on .is-hidden.
   ════════════════════════════════════════════════════════════════ */

const filterBtns   = $$('.filter-btn');
const projectCards = $$('.project-card[data-category]');

if (filterBtns.length && projectCards.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const match = filter === 'all' ||
                      card.getAttribute('data-category') === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });
}


/* ════════════════════════════════════════════════════════════════
   5. AUTO MARK ACTIVE NAV LINK
   Reads the current filename and marks the matching .nav-link.
   Overrides the hard-coded is-active class in HTML so every
   page stays consistent without manual edits.
   ════════════════════════════════════════════════════════════════ */

(function markActive() {
  const file = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    link.classList.toggle(
      'is-active',
      href === file || (file === '' && href === 'index.html')
    );
  });
})();


/* ════════════════════════════════════════════════════════════════
   6. CURSOR GLOW (fine-pointer / desktop only)
   Soft rgba(0,240,255) radial gradient follows the cursor.
   Uses --clr-cyan as per the design spec.
   Scales up when hovering interactive elements.
   ════════════════════════════════════════════════════════════════ */

if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.setAttribute('aria-hidden', 'true');
  Object.assign(glow.style, {
    position:      'fixed',
    pointerEvents: 'none',
    zIndex:        '9998',
    width:         '380px',
    height:        '380px',
    borderRadius:  '50%',
    background:    'radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 68%)',
    transform:     'translate(-50%,-50%) scale(0)',
    transition:    'transform 0.5s ease',
    willChange:    'left, top, transform',
  });
  document.body.appendChild(glow);

  let glowActive = false;
  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top  = `${e.clientY}px`;
    if (!glowActive) {
      glow.style.transform = 'translate(-50%,-50%) scale(1)';
      glowActive = true;
    }
  });

  /* Expand on hover of interactive / card elements */
  const hoverTargets = 'a, button, .project-card, .discipline-card, .timeline-entry';
  $$(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      glow.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      glow.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}


/* ════════════════════════════════════════════════════════════════
   7. SMOOTH ANCHOR SCROLL
   For <a href="#section"> links — accounts for sticky navbar height.
   ════════════════════════════════════════════════════════════════ */

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = $(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH  = navbar?.offsetHeight ?? 72;
    const top   = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
