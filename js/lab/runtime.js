const reduced = matchMedia('(prefers-reduced-motion: reduce)');

export function createRuntime(stage, settings, onFailure) {
  const controller = new AbortController();
  const {signal} = controller;
  const cleanup = [];
  let experiment, frame, previous, observer, visibility;
  let paused = false, onScreen = true;
  const size = () => {
    const box = stage.getBoundingClientRect();
    return {width: Math.max(1, box.width), height: Math.max(1, box.height),
      dpr: Math.min(devicePixelRatio || 1, box.width < 550 ? 1.15 : 1.5,
        Math.sqrt(750000 / Math.max(1, box.width * box.height)))};
  };
  function invalidate() {
    if (!frame && experiment && !signal.aborted && !document.hidden && onScreen) {
      frame = requestAnimationFrame(draw);
    }
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = previous = undefined;
  }
  function draw(now) {
    frame = undefined;
    const dt = Math.min(.05, (now - (previous ?? now - 16)) / 1000);
    previous = now;
    try {
      const moving = experiment.draw(paused ? 0 : dt, reduced.matches);
      if (moving && !paused && !reduced.matches) invalidate();
      else previous = undefined;
    } catch (error) { onFailure(error); }
  }
  function resize() {
    try { experiment.resize(size()); invalidate(); }
    catch (error) { onFailure(error); }
  }
  function listen(target, type, handler) { target.addEventListener(type, handler, {signal}); }
  listen(document, 'visibilitychange', () => document.hidden ? stop() : invalidate());
  listen(reduced, 'change', () => { stop(); invalidate(); });
  return {
    api: {
      stage, settings, listen, invalidate, size, fail: onFailure,
      cleanup: callback => cleanup.push(callback),
      canvas(label) {
        const canvas = document.createElement('canvas');
        canvas.className = 'experiment-canvas';
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', label);
        stage.append(canvas);
        return canvas;
      },
      pointer(canvas, onMove) {
        function update(event) {
          if (event.pointerType !== 'mouse' && event.type === 'pointermove' && !canvas.hasPointerCapture(event.pointerId)) return;
          const box = canvas.getBoundingClientRect();
          onMove(
            Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)),
            Math.max(0, Math.min(1, (event.clientY - box.top) / box.height))
          );
          invalidate();
        }
        listen(canvas, 'pointerdown', event => {
          if (event.isPrimary) canvas.setPointerCapture(event.pointerId);
          update(event);
        });
        listen(canvas, 'pointermove', update);
      }
    },
    activate(instance) {
      experiment = instance;
      observer = new ResizeObserver(resize);
      observer.observe(stage);
      visibility = new IntersectionObserver(entries => {
        onScreen = entries.at(-1).isIntersecting;
        if (onScreen) invalidate();
        else stop();
      });
      visibility.observe(stage);
      resize();
    },
    invalidate,
    pause(value) { paused = value; stop(); invalidate(); },
    reset() { experiment?.reset?.(); invalidate(); },
    dispose() {
      controller.abort();
      observer?.disconnect();
      visibility?.disconnect();
      stop();
      for (const release of cleanup.reverse()) release();
      stage.replaceChildren();
    }
  };
}

export function canvas2d(api, label) {
  const canvas = api.canvas(label);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');
  const surface = {canvas, ctx, resize({width, height, dpr}) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    Object.assign(surface, {width, height});
  }};
  api.cleanup(() => { canvas.width = canvas.height = 1; });
  return surface;
}
