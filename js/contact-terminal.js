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

  formFrame.inert = false;
  if (p > .05) hintHidden = true;
  else if (target === 0) hintHidden = false;
  hint.classList.toggle('is-faded', hintHidden);
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
registerScrollMotion({
  enable(enabled) {
    active = enabled && CSS.supports('overflow', 'clip') && 'inert' in formFrame;
    document.documentElement.classList.toggle('contact-motion-enabled', active);
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


// Native validation runs before submit. Keep the original POST as the no-JS fallback.
const feedback = document.querySelector('#form-status');
let sending = false;
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending) return;
  sending = true;
  submit.disabled = true;
  form.setAttribute('aria-busy', 'true');
  feedback.textContent = 'Sending your message…';
  try {
    const response = await fetch(form.action, {
      method: 'POST', body: new FormData(form), headers: {Accept: 'application/json'},
    });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    feedback.textContent = 'Your message has been sent. Thank you.';
  } catch {
    feedback.textContent = 'Your message could not be sent. Please try again or use the email link above.';
  } finally {
    sending = false;
    submit.disabled = false;
    form.removeAttribute('aria-busy');
  }
});
