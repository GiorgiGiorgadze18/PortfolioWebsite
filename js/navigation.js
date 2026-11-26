(() => {
const $ = selector => document.querySelector(selector);
const $$ = (selector, root) => [...root.querySelectorAll(selector)];
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
  mobileMenu.inert = !isOpen;
  if (isOpen) mobileMenu.querySelector('a')?.focus();
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  if (mobileMenu.contains(document.activeElement)) hamburger.focus();
  mobileMenu.inert = true;
  mobileMenu.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (mobileMenu) mobileMenu.inert = !mobileMenu.classList.contains('is-open');
window.addEventListener('resize', () => {
  if (innerWidth > 768) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Tab' || !mobileMenu?.classList.contains('is-open')) return;
  const controls = [hamburger, ...mobileMenu.querySelectorAll('a')];
  const first = controls[0], last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
});
window.addEventListener('scroll', onScroll, { passive: true });
hamburger?.addEventListener('click', toggleMenu);
mobileMenu?.addEventListener('click', (e) => { if (e.target === mobileMenu) closeMenu(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
  }
});
$$('.nav-link', mobileMenu ?? document).forEach(l => l.addEventListener('click', closeMenu));


onScroll();
})();
