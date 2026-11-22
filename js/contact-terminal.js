import {clampProgress, registerScrollMotion} from './scroll-motion.js';

const pin = document.querySelector('#secure-transmission');
const terminal = pin.querySelector('.terminal-window');
const stick = pin.querySelector('.stick');
const completeLog = terminal.querySelector('.terminal-log__complete');
const typedLog = terminal.querySelector('.terminal-log__typed');
const bar = terminal.querySelector('progress');
const percentage = bar.nextElementSibling;
const formFrame = terminal.querySelector('#terminal-form');
const form = formFrame.querySelector('form');
const submit = form.querySelector('[type="submit"]');
const skip = terminal.querySelector('.terminal-skip');
const start = document.querySelector('[data-terminal-start]');
const hint = pin.querySelector('[data-terminal-hint]');
const status = document.querySelector('.status-pill span:last-child').textContent.trim();
const log = completeLog.textContent.replace(/^> channel open \/\/ .*$/m,
  () => '> channel open // ' + status.toUpperCase());
completeLog.textContent = log;

let active = false;
let visible = false;
let progress = null;
let target = 0;
let hintHidden = false;

function render(p) {
  const boot = clampProgress(p / .7);
  const percent = Math.round(boot * 100);
  const typing = boot < 1;
  terminal.classList.toggle('is-typing', typing);
  if (typing) {
    const text = log.slice(0, Math.floor(boot * log.length));
    if (typedLog.textContent !== text) typedLog.textContent = text;
  }
  if (bar.value !== percent) {
    bar.value = percent;
    percentage.textContent = percent + '%';
  }

  const reveal = clampProgress((p - .7) / .18);
  const easedReveal = reveal * reveal * (3 - 2 * reveal);
  formFrame.style.setProperty('--terminal-form-opacity', easedReveal);
  formFrame.style.setProperty('--terminal-form-offset', (1 - easedReveal) * 24 + 'px');

  formFrame.inert = p <= .88;

  submit.classList.toggle('armed', active && p > .92);
  if (p > .05) hintHidden = true;
  else if (target === 0) hintHidden = false;
  hint.classList.toggle('is-faded', hintHidden);
}

function goToForm() {
  target = progress = 1;
  render(progress);
  const rect = pin.getBoundingClientRect();
  const stickRect = stick.getBoundingClientRect();
  const formOffset = formFrame.getBoundingClientRect().top - stickRect.top;
  const margin = parseFloat(getComputedStyle(formFrame).scrollMarginTop);
  const end = window.scrollY + rect.bottom - stickRect.height;
  window.scrollTo({top: Math.ceil(end + Math.max(0, formOffset - margin)), behavior: 'instant'});
}

function handleLink(link, navigate) {
  // The site's general anchor handler would otherwise start a second scroll.
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    navigate();
  }, {capture: true});
}

handleLink(start, () => pin.scrollIntoView({behavior: active ? 'smooth' : 'instant', block: 'start'}));
handleLink(skip, goToForm);

skip.addEventListener('keydown', event => {
  // Unlock before the browser does its native forward Tab from Skip to the fields.
  if (event.key === 'Tab' && !event.shiftKey && active && progress < 1) goToForm();
});

form.addEventListener('focusin', () => {
  if (active && progress < 1) goToForm();
});

registerScrollMotion({
  enable(enabled) {
    active = enabled && CSS.supports('overflow', 'clip') && 'inert' in formFrame;
    document.documentElement.classList.toggle('contact-motion-enabled', active);
    skip.hidden = !active;
    visible = false;
    target = 0;
    hintHidden = false;
    progress = null;
    render(active ? 0 : 1);
  },
  update({height, lerp}) {
    if (!active) return false;
    const rect = pin.getBoundingClientRect();
    visible = rect.top < height && rect.bottom > 0;
    if (!visible) return false;
    // Keep the form available if a visitor scrolls back while editing a field.
    const scrolled = rect.top < -1 ? -rect.top : 0;
    target = form.contains(document.activeElement)
      ? 1
      : clampProgress(scrolled / Math.max(1, rect.height - stick.offsetHeight));
    progress = lerp(progress, target, .12);
    return progress !== target;
  },
  paint() {
    if (active && visible) render(progress);
  },
}, pin, stick);
