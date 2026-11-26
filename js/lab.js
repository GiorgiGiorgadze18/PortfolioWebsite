(() => {
  const card = document.querySelector('[data-hologram] .discipline-card');
  const form = document.querySelector('.lab-controls');
  if (!card || !form) return;
  if (!CSS.supports('transform-style', 'preserve-3d') || !('IntersectionObserver' in window)) {
    document.querySelector('#lab-fallback').hidden = false;
    return;
  }

  const strength = form.querySelector('#lab-strength');
  const reflection = form.querySelector('#lab-reflection');
  const pause = form.querySelector('#lab-pause');
  const status = form.querySelector('#lab-motion-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function resetTilt() {
    card.dispatchEvent(new Event('hologram-reset'));
  }

  function syncSettings() {
    card.dataset.holoStrength = strength.value;
    card.style.setProperty('--lab-reflection', reflection.value);
    form.querySelector('#strength-value').textContent = strength.value + '×';
    form.querySelector('#reflection-value').textContent = Number(reflection.value).toFixed(2);
    resetTilt();
  }

  function syncMotion() {
    strength.disabled = reduced.matches;
    pause.disabled = reduced.matches;
    status.textContent = reduced.matches
      ? 'Reduced motion is enabled. Reflection remains adjustable.'
      : card.hasAttribute('data-motion-paused') ? 'Card motion paused.' : '';
  }

  pause.addEventListener('click', () => {
    const paused = !card.hasAttribute('data-motion-paused');
    card.toggleAttribute('data-motion-paused', paused);
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Resume card motion' : 'Pause card motion';
    resetTilt();
    syncMotion();
  });

  form.addEventListener('input', syncSettings);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', event => {
    event.preventDefault();
    strength.value = strength.defaultValue;
    reflection.value = reflection.defaultValue;
    card.removeAttribute('data-motion-paused');
    pause.setAttribute('aria-pressed', 'false');
    pause.textContent = 'Pause card motion';
    syncSettings();
    syncMotion();
  });

  reduced.addEventListener('change', syncMotion);
  form.hidden = false;
  syncSettings();
  syncMotion();
})();
