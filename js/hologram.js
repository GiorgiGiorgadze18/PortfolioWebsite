(() => {
  if (!CSS.supports('transform-style', 'preserve-3d') || !('IntersectionObserver' in window)) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.min(1, Math.max(-1, value));

  document.querySelectorAll('[data-hologram]').forEach(scene => {
    let frame = 0;
    let lastTime;
    let visible = false;
    let entered = false;
    let drag;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    function schedule() {
      if (!frame && visible && !reduced.matches) frame = requestAnimationFrame(update);
    }

    function update(time) {
      frame = 0;
      const elapsed = Math.min(40, time - (lastTime ?? time - 16.7));
      const damping = 1 - Math.exp(-elapsed / 95);
      x += (targetX - x) * damping;
      y += (targetY - y) * damping;
      const moving = Math.abs(targetX - x) + Math.abs(targetY - y) > .002;
      if (!moving) {
        x = targetX;
        y = targetY;
      }
      scene.style.setProperty('--holo-rx', `${13 - y * 10}deg`);
      scene.style.setProperty('--holo-ry', `${-17 + x * 14}deg`);
      scene.style.setProperty('--holo-light', `${x * 28}px`);
      lastTime = moving ? time : undefined;
      if (moving) schedule();
    }

    function point(xValue, yValue) {
      targetX = clamp(xValue);
      targetY = clamp(yValue);
      scene.style.setProperty('--holo-depth', '3px');
      schedule();
    }

    function reset() {
      drag = undefined;
      targetX = targetY = 0;
      scene.style.removeProperty('--holo-depth');
      schedule();
    }

    scene.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.pointerType === 'mouse' || reduced.matches) return;
      drag = {id: event.pointerId, x: event.clientX, y: event.clientY};
      scene.setPointerCapture(event.pointerId);
    });
    scene.addEventListener('pointermove', event => {
      if (!visible || reduced.matches) return;
      if (drag?.id === event.pointerId) {
        point((event.clientX - drag.x) / 90, (event.clientY - drag.y) / 75);
      } else if (event.pointerType === 'mouse') {
        const bounds = scene.getBoundingClientRect();
        point((event.clientX - bounds.left) * 2 / bounds.width - 1,
          (event.clientY - bounds.top) * 2 / bounds.height - 1);
      }
    });
    scene.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse') reset();
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      scene.addEventListener(type, event => {
        if (drag?.id === event.pointerId) reset();
      });
    }

    function syncMotion() {
      scene.classList.toggle('is-ready', !reduced.matches);
      if (visible && !reduced.matches && !entered) {
        entered = true;
        scene.classList.add('is-entering');
      }
      if (reduced.matches || !visible) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = undefined;
        if (reduced.matches) scene.classList.remove('is-entering');
        reset();
      }
    }

    scene.addEventListener('animationend', event => {
      if (event.animationName === 'hologram-arrive') scene.classList.remove('is-entering');
    });
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      scene.classList.toggle('is-visible', visible);
      syncMotion();
      if (visible) schedule();
    }).observe(scene);
    reduced.addEventListener('change', syncMotion);
  });
})();
