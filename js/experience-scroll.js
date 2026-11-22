import {clampProgress, registerScrollMotion} from './scroll-motion.js';

const section = document.querySelector('#experience');
const timeline = section?.querySelector('.timeline');
const railTop = 12;
const railBottom = 10;

if (timeline?.lastElementChild) {
  const items = Array.from(timeline.querySelectorAll('.timeline-entry'), entry => ({
    entry, dot: entry.querySelector('.timeline-entry__dot'), progress: null, active: false,
  }));
  const lastEntry = items.at(-1).entry;
  const lastCard = lastEntry.querySelector('.timeline-entry__content');
  let progress = null;

  registerScrollMotion({
    enable(enabled) {
      section.classList.toggle('experience-scroll-enabled', enabled);
      progress = null;
      if (!enabled) timeline.style.removeProperty('--timeline-progress');
      for (const item of items) {
        item.progress = null;
        if (!enabled) {
          item.entry.style.removeProperty('--timeline-activation');
          item.entry.classList.remove('is-scroll-active');
        }
      }
    },
    update({height, lerp}) {
      const bounds = section.getBoundingClientRect();
      // Use the card’s layout center so its own entrance translate cannot shift the endpoint.
      const lastCenter = timeline.getBoundingClientRect().top + lastEntry.offsetTop +
        lastCard.offsetTop + lastCard.offsetHeight / 2;
      const distance = lastCenter - bounds.top + height * .15;
      const target = clampProgress((height * .65 - bounds.top) / Math.max(1, distance));
      progress = lastCenter <= height / 2 ? 1 : lerp(progress, target, .14);

      // Both offsets use static layout, so an animated card cannot move its own trigger.
      const railLength = Math.max(0, timeline.clientHeight - railTop - railBottom);
      const fillEnd = railTop + railLength * progress;
      let moving = progress !== target;
      for (const item of items) {
        const dotCenter = item.entry.offsetTop + item.dot.offsetTop + item.dot.offsetHeight / 2;
        item.active = fillEnd >= dotCenter;
        const end = Number(item.active);
        item.progress = lerp(item.progress, end, .14);
        if (item.progress !== end) moving = true;
      }
      return moving;
    },
    paint() {
      timeline.style.setProperty('--timeline-progress', progress.toFixed(4));
      for (const item of items) {
        item.entry.classList.toggle('is-scroll-active', item.active);
        item.entry.style.setProperty('--timeline-activation', item.progress.toFixed(4));
      }
    },
  }, document.querySelector('main'), timeline);
}
