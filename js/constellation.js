(() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.className = 'constellation';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const theme = getComputedStyle(document.documentElement);
  const cyan = (theme.getPropertyValue('--clr-cyan') || theme.getPropertyValue('--cyan')).trim();
  const purple = (theme.getPropertyValue('--clr-purple') || theme.getPropertyValue('--purple')).trim();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const TAU = Math.PI * 2;
  const drift = 18;
  const attraction = 38;
  const lineBands = Array.from({length: 6}, () => new Path2D());
  const pointerBands = Array.from({length: 4}, () => new Path2D());
  let points = [];
  let neighbors = [];
  let width = 0, height = 0, pixelRatio = 0, spacing = 0;
  let stageCoversViewport = false, staticFrame = false, pointer = null;
  let frameId = 0, lastFrame = 0, elapsed = 0, resizeTimer;
  let updateStageCoverage;
  const root = document.documentElement;
  const shouldPause = () => document.hidden || reduced.matches || stageCoversViewport || root.hasAttribute('data-case-study-active');

  function build() {
    const {clientWidth, clientHeight} = document.documentElement;
    const ratio = Math.min(devicePixelRatio || 1, 1, Math.sqrt(1000000 / (clientWidth * clientHeight)));
    if (!clientWidth || !clientHeight) return;
    if (clientWidth === width && clientHeight === height && ratio === pixelRatio) return;

    width = clientWidth;
    height = clientHeight;
    pixelRatio = ratio;
    staticFrame = false;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);

    const area = width * height;
    const cap = width < 700 || !finePointer.matches ? 45 : 110;
    const count = Math.max(1, Math.min(cap, Math.round(area / 14000)));
    const rows = Math.min(count, Math.max(1, Math.round(Math.sqrt(count * height / width))));
    spacing = Math.sqrt(area / count);
    points = [];

    for (let row = 0; row < rows; row++) {
      const columns = Math.round((row + 1) * count / rows) - Math.round(row * count / rows);
      for (let col = 0; col < columns; col++) {
        const x = (col + .5 + (Math.random() - .5) * .36) * width / columns;
        const y = (row + .5 + (Math.random() - .5) * .36) * height / rows;
        points.push({homeX: x, homeY: y, x, y, phase: Math.random() * TAU,
          speed: .25 + Math.random() * .35, offsetX: 0, offsetY: 0});
      }
    }

    // Pairs beyond the link radius plus both points' maximum travel can never meet.
    neighbors = [];
    const extent = (spacing * 1.6 + 2 * (drift + attraction)) ** 2;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        if ((a.homeX - b.homeX) ** 2 + (a.homeY - b.homeY) ** 2 <= extent) {
          neighbors.push([a, b]);
        }
      }
    }
  }

  function draw(animate, delta = 0) {
    const activePointer = animate && (finePointer.matches ? pointer : {
      x: width * (.5 + .35 * Math.sin(elapsed * .35)),
      y: height * (.5 + .3 * Math.sin(elapsed * .24 + 1)),
    });
    const spring = 1 - Math.exp(-delta * 4.8);
    for (const point of points) {
      let targetX = 0, targetY = 0;
      if (activePointer) {
        const dx = activePointer.x - point.homeX;
        const dy = activePointer.y - point.homeY;
        const squared = dx * dx + dy * dy;
        if (squared > 0 && squared < 170 ** 2) {
          const distance = Math.sqrt(squared);
          const pull = attraction * (1 - distance / 170) ** 2 / distance;
          targetX = dx * pull;
          targetY = dy * pull;
        }
      }
      point.offsetX += (targetX - point.offsetX) * spring;
      point.offsetY += (targetY - point.offsetY) * spring;
      const angle = elapsed * point.speed + point.phase;
      point.x = point.homeX + (animate ? Math.cos(angle) * drift + point.offsetX : 0);
      point.y = point.homeY + (animate ? Math.sin(angle) * drift + point.offsetY : 0);
    }

    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < lineBands.length; i++) lineBands[i] = new Path2D();
    const link = spacing * 1.6;
    for (const [a, b] of neighbors) {
      const squared = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
      if (squared >= link * link) continue;
      const fade = 1 - Math.sqrt(squared) / link;
      const path = lineBands[Math.min(lineBands.length - 1, Math.floor(fade * lineBands.length))];
      path.moveTo(a.x, a.y);
      path.lineTo(b.x, b.y);
    }
    ctx.strokeStyle = cyan;
    ctx.lineWidth = .8;
    for (let i = 0; i < lineBands.length; i++) {
      ctx.globalAlpha = .27 * (i + .5) / lineBands.length;
      ctx.stroke(lineBands[i]);
    }

    if (activePointer) {
      ctx.strokeStyle = purple;
      ctx.lineWidth = 1.1;
      for (let i = 0; i < pointerBands.length; i++) pointerBands[i] = new Path2D();
      for (const point of points) {
        const dx = point.x - activePointer.x, dy = point.y - activePointer.y;
        const squared = dx * dx + dy * dy;
        if (squared >= 200 ** 2) continue;
        const fade = 1 - Math.sqrt(squared) / 200;
        const path = pointerBands[Math.min(pointerBands.length - 1, Math.floor(fade * pointerBands.length))];
        path.moveTo(point.x, point.y);
        path.lineTo(activePointer.x, activePointer.y);
      }
      for (let i = 0; i < pointerBands.length; i++) {
        ctx.globalAlpha = .83 * (i + .5) / pointerBands.length;
        ctx.stroke(pointerBands[i]);
      }
    }

    ctx.fillStyle = cyan;
    ctx.globalAlpha = .53;
    ctx.beginPath();
    for (const {x, y} of points) {
      ctx.moveTo(x + 1.15, y);
      ctx.arc(x, y, 1.15, 0, TAU);
    }
    ctx.fill();
  }

  function animate(time) {
    if (shouldPause()) {
      syncMotion();
      return;
    }
    frameId = requestAnimationFrame(animate);
    const interval = time - lastFrame;
    if (interval < 1000 / (finePointer.matches ? 60 : 30) - 1) return;
    const delta = Math.min(interval / 1000, .075);
    lastFrame = time;
    elapsed += delta;
    draw(true, delta);
  }

  function syncMotion() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    if (document.hidden) return;
    if (shouldPause()) {
      if (!staticFrame) draw(false);
      staticFrame = true;
    } else {
      staticFrame = false;
      lastFrame = performance.now();
      draw(true);
      frameId = requestAnimationFrame(animate);
    }
  }

  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      pointer = {x: event.clientX, y: event.clientY};
    }
  }, {passive: true});
  document.documentElement.addEventListener('pointerleave', () => {pointer = null;});
  window.addEventListener('blur', () => {pointer = null;});
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      updateStageCoverage?.();
      syncMotion();
    }, 130);
  }, {passive: true});
  document.addEventListener('visibilitychange', syncMotion);
  reduced.addEventListener('change', syncMotion);

  // The stage is opaque enough to cover the network without a compositing clip.
  const stage = document.querySelector('#museum-frame');
  if (stage) {
    let pending = 0;
    function updateCoverage() {
      pending = 0;
      const bounds = stage.getBoundingClientRect();
      const covered = bounds.height > 0 &&
        bounds.top <= (document.querySelector('#navbar')?.offsetHeight ?? 0) &&
        bounds.bottom >= height - 1;
      if (stageCoversViewport !== covered) {
        stageCoversViewport = covered;
        syncMotion();
      }
    }
    updateStageCoverage = () => {
      if (!pending) pending = requestAnimationFrame(updateCoverage);
    };
    new IntersectionObserver(updateStageCoverage).observe(stage);
    new ResizeObserver(updateStageCoverage).observe(stage);
    window.addEventListener('scroll', updateStageCoverage, {passive: true});
  }
  new MutationObserver(syncMotion).observe(root, {attributes:true, attributeFilter:['data-case-study-active']});

  build();
  syncMotion();
})();
