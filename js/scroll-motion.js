const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const effects = [];
let frameId = 0;
let previousTime = null;

export const clampProgress = value => Math.min(1, Math.max(0, value));

function schedule() {
  if (!frameId && !document.hidden && !reduced.matches) {
    frameId = requestAnimationFrame(frame);
  }
}

function frame(time) {
  frameId = 0;
  if (document.hidden || reduced.matches) return;

  const frames = previousTime === null ? 1 : Math.min(4, (time - previousTime) / (1000 / 60));
  previousTime = time;
  const context = {
    height: window.innerHeight,
    lerp(start, end, factor) {
      if (start === null || Math.abs(end - start) < .0005) return end;
      return start + (end - start) * (1 - (1 - factor) ** frames);
    },
  };

  // Read and update all geometry before either effect writes styles.
  let moving = false;
  for (const effect of effects) {
    if (effect.update(context)) moving = true;
  }
  effects.forEach(effect => effect.paint());

  if (moving) schedule();
  else previousTime = null;
}

function syncPreference() {
  cancelAnimationFrame(frameId);
  frameId = 0;
  previousTime = null;
  effects.forEach(effect => effect.enable(!reduced.matches));
  schedule();
}

window.addEventListener('scroll', schedule, {passive: true});
window.addEventListener('resize', schedule, {passive: true});
window.addEventListener('pageshow', schedule);
document.addEventListener('visibilitychange', () => {
  previousTime = null;
  schedule();
});
reduced.addEventListener('change', syncPreference);

export function registerScrollMotion(effect, ...layoutElements) {
  effects.push(effect);
  const observer = new ResizeObserver(schedule);
  layoutElements.forEach(element => observer.observe(element));
  effect.enable(!reduced.matches);
  schedule();
}
