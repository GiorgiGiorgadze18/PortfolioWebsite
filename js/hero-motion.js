(() => {
  const root = document.documentElement;
  const hero = document.querySelector('#hero');
  const heading = hero?.querySelector('.hero__title');
  const bio = hero?.querySelector('.hero__bio');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');
  if (!heading || !bio || reduced.matches) return;

  function rangeFor(node, start, end) {
    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);
    return range;
  }

  function layerFor(element, letters) {
    const source = document.createElement('span');
    source.className = 'hero-motion-source';
    source.append(...element.childNodes);
    const layer = document.createElement('span');
    layer.className = 'hero-motion-layer';
    layer.setAttribute('aria-hidden', 'true');
    element.append(source, layer);

    const words = [];
    const glyphs = [];
    const walker = document.createTreeWalker(source, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.data.trim()) continue;
      const style = getComputedStyle(node.parentElement);
      const transparent = style.webkitTextFillColor === 'transparent' ||
        style.webkitTextFillColor === 'rgba(0, 0, 0, 0)';
      const pad = parseFloat(style.fontSize) * .27;

      for (const {0: text, index} of node.data.matchAll(/\S+/g)) {
        const mask = document.createElement('span');
        mask.className = letters ? 'w' : 'mk';
        Object.assign(mask.style, {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
          letterSpacing: style.letterSpacing,
          textShadow: style.textShadow,
          textTransform: style.textTransform,
          color: style.color,
          webkitTextStroke: style.webkitTextStroke,
        });
        const wordRange = rangeFor(node, index, index + text.length);
        const units = letters ? Array.from(text) : [text];
        let start = index;
        const entries = [];
        for (const unit of units) {
          const glyph = document.createElement('span');
          glyph.className = letters ? 'ch' : 'wd';
          glyph.textContent = unit;
          const entry = {glyph, range: rangeFor(node, start, start + unit.length),
            color: letters && !transparent ? style.color : null, x: 0, y: 0};
          entries.push(entry);
          glyphs.push(entry);
          mask.append(glyph);
          start += unit.length;
        }
        words.push({mask, range: wordRange, entries, pad});
        layer.append(mask);
      }
    }

    // Keep the original text flow as the layout and accessibility source.
    // The motion layer uses the browser's shaped ranges, including kerning and wraps.
    function fit() {
      const origin = element.getBoundingClientRect();
      const measurements = words.map(({range, entries}) => ({
        word: range.getBoundingClientRect(),
        glyphs: entries.map(entry => entry.range.getBoundingClientRect()),
      }));
      words.forEach(({mask, entries, pad}, i) => {
        const {word, glyphs} = measurements[i];
        mask.style.left = `${word.left - origin.left - pad}px`;
        mask.style.top = `${word.top - origin.top}px`;
        mask.style.width = `${word.width + 2 * pad}px`;
        mask.style.setProperty('--word-height', `${word.height}px`);
        entries.forEach((entry, j) => {
          const bounds = glyphs[j];
          entry.glyph.style.left = `${bounds.left - word.left + pad}px`;
          entry.x = bounds.left - origin.left + bounds.width / 2;
          entry.y = bounds.top - origin.top + bounds.height / 2;
        });
      });
    }

    return {element, glyphs, fit, radius: letters ? 220 : 140,
      shift: letters ? 34 : 12, grow: letters ? .22 : 0, restore: 0};
  }

  heading.setAttribute('aria-label', heading.textContent.replace(/\s+/g, ' ').trim());
  const title = layerFor(heading, true);
  const paragraph = layerFor(bio, false);
  const tracks = [title, paragraph];
  const step = Math.min(55, 880 / Math.max(title.glyphs.length - 1, 1));
  const paragraphStart = 1600;
  const paragraphStep = 40;
  let ready = false, pointer = null, pointerFrame = 0;

  title.glyphs.forEach(({glyph}, i) => glyph.style.setProperty('--intro-delay', `${700 + i * step}ms`));
  paragraph.glyphs.forEach(({glyph}, i) => glyph.style.setProperty('--intro-delay', `${paragraphStart + i * paragraphStep}ms`));
  for (const track of tracks) {
    track.element.classList.add('hero-motion-active');
    track.fit();
    new ResizeObserver(track.fit).observe(track.element);
  }
  document.fonts.ready.then(() => tracks.forEach(track => track.fit()));

  function start() {
    setTimeout(() => {
      if (ready) return;
      if (reduced.matches) return finish();
      tracks.forEach(track => track.fit());
      root.classList.add('hero-go');
      setTimeout(() => root.classList.add('hero-done'), 2600);
      const paragraphEnd = paragraphStart + 900 + (paragraph.glyphs.length - 1) * paragraphStep;
      setTimeout(finish, Math.max(2600, paragraphEnd));
    }, 150);
  }

  function finish() {
    if (ready) return;
    root.classList.add('hero-go', 'hero-done', 'hero-words-done');
    for (const {element} of tracks) element.classList.remove('hero-motion-active');
    ready = true;
  }

  function react() {
    pointerFrame = 0;
    for (const track of tracks) {
      const {left, top} = track.element.getBoundingClientRect();
      let affected = false;
      for (const {glyph, color, x, y} of track.glyphs) {
        const dx = left + x - (pointer?.x ?? Infinity);
        const dy = top + y - (pointer?.y ?? Infinity);
        const distance = Math.hypot(dx, dy);
        if (distance < track.radius) {
          const strength = 1 - distance / track.radius;
          const shift = strength * track.shift / (distance || 1);
          glyph.style.translate = `${dx * shift}px ${dy * shift}px`;
          if (track.grow) glyph.style.scale = String(1 + strength * track.grow);
          if (color) glyph.style.color = `color-mix(in srgb, var(--clr-cyan) ${strength * 100}%, ${color})`;
          affected = true;
        } else {
          glyph.style.translate = '';
          glyph.style.scale = '';
          glyph.style.color = '';
        }
      }
      if (affected) {
        clearTimeout(track.restore);
        track.restore = 0;
        track.element.classList.add('hero-motion-active');
      } else if (!track.restore && track.element.classList.contains('hero-motion-active')) {
        track.restore = setTimeout(() => {
          track.element.classList.remove('hero-motion-active');
          track.restore = 0;
        }, 350);
      }
    }
  }

  function reset() {
    pointer = null;
    if (ready && !pointerFrame) pointerFrame = requestAnimationFrame(react);
  }

  hero.addEventListener('pointermove', event => {
    if (!ready || reduced.matches || !canHover.matches || event.pointerType === 'touch') return;
    pointer = {x: event.clientX, y: event.clientY};
    if (!pointerFrame) pointerFrame = requestAnimationFrame(react);
  }, {passive: true});
  hero.addEventListener('pointerleave', reset);
  reduced.addEventListener('change', () => {
    if (reduced.matches) finish();
    reset();
  });
  canHover.addEventListener('change', reset);

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, {once: true});
})();
