let geometryPromise;

function loadGeometry() {
  geometryPromise ??= fetch(new URL('assets/maps/tbilisi.tsv', import.meta.url))
    .then(response => {
      if (!response.ok) throw new Error('Map data could not be loaded');
      return response.text();
    })
    .then(text => {
      const [extent, ...records] = text.trim().split('\n');
      const [width, height] = extent.split('|').map(Number);
      const layers = new Map();
      const labels = [];
      let marker;
      for (const record of records) {
        const [kind, name, geometry] = record.split('|');
        if (kind === 'M' || kind === 'L') {
          const [x, y] = geometry.split(',').map(Number);
          if (kind === 'M') marker = {x, y};
          else labels.push({name, x, y});
          continue;
        }
        if (!layers.has(kind)) layers.set(kind, new Path2D());
        const path = layers.get(kind);
        for (const ring of geometry.split(';')) {
          const points = ring.split(' ');
          for (let i = 0; i < points.length; i++) {
            const [x, y] = points[i].split(',').map(Number);
            if (i === 0) path.moveTo(x, y);
            else path.lineTo(x, y);
          }
          if (kind === 'G' || kind === 'W') path.closePath();
        }
      }
      return {width, height, layers, labels, marker};
    }).catch(error => {
      geometryPromise = null;
      throw error;
    });
  return geometryPromise;
}

export function mountMap(canvas, fallback, onMarker) {
  const ctx = canvas.getContext('2d');
  const listeners = new AbortController();
  const options = {signal: listeners.signal};
  const pointers = new Map();
  let geometry;
  let width = 0, height = 0, pixelRatio = 1;
  let minimum = 0, scale = 0, x = 0, y = 0;
  let frame = 0;
  let down;
  let pinched = false;
  const unit = () => width / 375;

  function constrain() {
    x = Math.max(width - geometry.width * scale, Math.min(0, x));
    y = Math.max(height - geometry.height * scale, Math.min(0, y));
  }

  function viewport() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const center = scale ? [(width / 2 - x) / scale, (height / 2 - y) / scale] : null;
    const zoom = scale ? scale / minimum : 1.35;
    width = rect.width;
    height = rect.height;
    pixelRatio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    if (!geometry) return;
    minimum = Math.max(width / geometry.width, height / geometry.height);
    scale = minimum * zoom;
    x = center ? width / 2 - center[0] * scale : width * .49 - geometry.marker.x * scale;
    y = center ? height / 2 - center[1] * scale : height * .45 - geometry.marker.y * scale;
    constrain();
    requestDraw();
  }

  function requestDraw() {
    if (!frame) frame = requestAnimationFrame(draw);
  }

  function zoom(factor, atX, atY) {
    if (!geometry || !scale) return;
    const original = scale;
    scale = Math.max(minimum, Math.min(minimum * 6, original * factor));
    x = atX - (atX - x) * scale / original;
    y = atY - (atY - y) * scale / original;
    constrain();
    requestDraw();
  }

  function stroke(path, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, lineWidth * unit()) / scale;
    ctx.stroke(path);
  }

  function draw() {
    frame = 0;
    if (!geometry || !scale) return;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.fillStyle = '#f0ede8';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const [kind, path] of geometry.layers) {
      switch (kind) {
        case 'G': ctx.fillStyle = '#dbe9d2'; ctx.fill(path); break;
        case 'W': ctx.fillStyle = '#acd7e8'; ctx.fill(path); break;
        case 'w': stroke(path, '#acd7e8', 1.4); break;
        case 'r': stroke(path, '#fdfcf9', 1.5); break;
        case 'R': stroke(path, '#e1c593', 4.2); stroke(path, '#fff4d8', 3); break;
      }
    }
    ctx.restore();

    const u = unit();
    ctx.font = `500 ${11 * u}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2 * u;
    ctx.strokeStyle = '#fffffff0';
    ctx.fillStyle = '#575451';
    for (const label of geometry.labels) {
      const left = x + label.x * scale;
      const top = y + label.y * scale;
      if (left < 0 || left > width || top < 0 || top > height) continue;
      ctx.strokeText(label.name, left, top);
      ctx.fillText(label.name, left, top);
    }

    ctx.save();
    ctx.translate(x + geometry.marker.x * scale, y + geometry.marker.y * scale - 16 * u);
    ctx.scale(u, u);
    ctx.beginPath();
    ctx.arc(0, 2, 21, 0, Math.PI * 2);
    ctx.fillStyle = '#0002';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 18.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3316';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(6, 0);
    ctx.moveTo(1, -5);
    ctx.lineTo(6, 0);
    ctx.lineTo(1, 5);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return {x: event.clientX - rect.left, y: event.clientY - rect.top};
  }

  canvas.addEventListener('pointerdown', event => {
    if (!geometry || event.button !== 0) return;
    const start = point(event);
    if (!pointers.size) {
      down = start;
      pinched = false;
    } else {
      pinched = true;
    }
    pointers.set(event.pointerId, start);
    canvas.setPointerCapture(event.pointerId);
  }, options);

  canvas.addEventListener('pointermove', event => {
    const previous = pointers.get(event.pointerId);
    if (!previous || !geometry) return;
    const next = point(event);
    const other = [...pointers].find(([id]) => id !== event.pointerId)?.[1];
    if (other) {
      const before = Math.hypot(other.x - previous.x, other.y - previous.y);
      const after = Math.hypot(other.x - next.x, other.y - next.y);
      x += (next.x - previous.x) / 2;
      y += (next.y - previous.y) / 2;
      zoom(after / Math.max(1, before), (next.x + other.x) / 2, (next.y + other.y) / 2);
    } else {
      x += next.x - previous.x;
      y += next.y - previous.y;
      constrain();
      requestDraw();
    }
    pointers.set(event.pointerId, next);
  }, options);

  canvas.addEventListener('pointerup', event => {
    if (!pointers.delete(event.pointerId) || !geometry || pinched) return;
    const cursor = point(event);
    const markerX = x + geometry.marker.x * scale;
    const markerY = y + geometry.marker.y * scale - 16 * unit();
    if (Math.hypot(cursor.x - down.x, cursor.y - down.y) < 6 &&
        Math.hypot(cursor.x - markerX, cursor.y - markerY) < 25 * unit()) onMarker();
  }, options);
  canvas.addEventListener('pointercancel', event => pointers.delete(event.pointerId), options);
  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    const cursor = point(event);
    zoom(Math.exp(-event.deltaY * .002), cursor.x, cursor.y);
  }, {...options, passive: false});
  canvas.addEventListener('map-zoom', event => zoom(event.detail, width / 2, height / 2), options);

  const observer = new ResizeObserver(viewport);
  observer.observe(canvas);
  loadGeometry().then(data => {
    if (listeners.signal.aborted) return;
    geometry = data;
    viewport();
  }).catch(() => {
    if (!listeners.signal.aborted) fallback.hidden = false;
  });

  return () => {
    listeners.abort();
    observer.disconnect();
    cancelAnimationFrame(frame);
  };
}
