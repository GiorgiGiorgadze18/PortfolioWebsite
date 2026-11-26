(() => {
  if (!CSS.supports('transform-style', 'preserve-3d') || !('IntersectionObserver' in window)) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = new Map();
  const moving = new Set();
  const clamp = value => Math.min(1, Math.max(-1, value));
  let frame = 0;
  let lastTime;

  function schedule() {
    if (!frame && moving.size && !reduced.matches && !document.hidden) frame = requestAnimationFrame(update);
  }

  function paint(card, state) {
    const strength = Number(card.dataset.holoStrength ?? 1);
    card.style.setProperty('--holo-rx', `${-state.y * 10 * strength}deg`);
    card.style.setProperty('--holo-ry', `${state.x * 14 * strength}deg`);
    card.style.setProperty('--holo-light-x', `${30 + state.x * 28}%`);
    card.style.setProperty('--holo-light-y', `${state.y * 32}%`);
  }

  function update(time) {
    frame = 0;
    if (document.hidden || reduced.matches) return;
    const elapsed = Math.min(40, time - (lastTime ?? time - 16.7));
    const damping = 1 - Math.exp(-elapsed / 95);

    for (const card of moving) {
      const state = cards.get(card);
      state.x += (state.targetX - state.x) * damping;
      state.y += (state.targetY - state.y) * damping;
      if (Math.abs(state.targetX - state.x) + Math.abs(state.targetY - state.y) <= .002) {
        state.x = state.targetX;
        state.y = state.targetY;
        moving.delete(card);
      }
      paint(card, state);
    }

    lastTime = moving.size ? time : undefined;
    schedule();
  }

  function point(card, state, x, y) {
    if (!state.visible || reduced.matches || document.hidden || card.hasAttribute('data-motion-paused')) return;
    state.targetX = clamp(x);
    state.targetY = clamp(y);
    if (!card.classList.contains('is-tilting')) {
      card.classList.add('is-tilting');
      card.style.setProperty('--holo-depth', '3px');
    }
    moving.add(card);
    schedule();
  }

  function reset(card, state, immediately = false) {
    state.drag = undefined;
    state.targetX = state.targetY = 0;
    card.classList.remove('is-tilting');
    card.style.removeProperty('--holo-depth');
    if (immediately) {
      state.x = state.y = 0;
      moving.delete(card);
      paint(card, state);
    } else {
      moving.add(card);
      schedule();
    }
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const card = entry.target;
      const state = cards.get(card);
      state.visible = entry.isIntersecting;
      card.classList.toggle('is-in-view', state.visible);
      if (!state.visible) reset(card, state, true);
    }
  });

  for (const card of document.querySelectorAll('#disciplines .discipline-card, [data-hologram] .discipline-card')) {
    const state = {x: 0, y: 0, targetX: 0, targetY: 0, visible: false, drag: undefined};
    cards.set(card, state);
    observer.observe(card);
    card.addEventListener('hologram-reset', () => reset(card, state, true));

    card.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.pointerType === 'mouse' || reduced.matches || card.hasAttribute('data-motion-paused')) return;
      state.drag = {id: event.pointerId, x: event.clientX, y: event.clientY};
      card.setPointerCapture(event.pointerId);
    });

    card.addEventListener('pointermove', event => {
      if (state.drag?.id === event.pointerId) {
        point(card, state, (event.clientX - state.drag.x) / 90, (event.clientY - state.drag.y) / 75);
      } else if (event.pointerType === 'mouse') {
        const bounds = card.getBoundingClientRect();
        point(card, state, (event.clientX - bounds.left) * 2 / bounds.width - 1,
          (event.clientY - bounds.top) * 2 / bounds.height - 1);
      }
    });

    card.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse' && card.classList.contains('is-tilting')) reset(card, state);
    });

    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      card.addEventListener(type, event => {
        if (state.drag?.id === event.pointerId) reset(card, state);
      });
    }
  }

  function syncMotion() {
    if (reduced.matches || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = undefined;
    }
    for (const [card, state] of cards) {
      card.classList.toggle('can-float', !reduced.matches);
      card.classList.toggle('is-motion-paused', document.hidden);
      if (reduced.matches || document.hidden) reset(card, state, true);
    }
  }

  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('blur', () => {
    for (const [card, state] of cards) {
      if (card.classList.contains('is-tilting')) reset(card, state);
    }
  });
  reduced.addEventListener('change', syncMotion);
  syncMotion();
})();
