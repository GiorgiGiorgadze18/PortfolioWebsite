import {canvas2d} from './runtime.js';

export function mount(api) {
  const surface = canvas2d(api, 'A field of points that morphs between globe, grid and wave shapes');
  const settings = api.settings;
  let points = [], pointer, coordinates, lastShape;
  function resize(size) {
    surface.resize(size);
    const count = size.width < 550 ? 216 : 384;
    if (points.length !== count) {
      points = Array.from({length: count}, () => ({x: 0, y: 0}));
      lastShape = undefined;
    }
  }
  api.pointer(surface.canvas, (x, y) => { pointer = [x, y]; });

  function target(i, count, radius) {
    if (settings.shape === 'Globe') {
      const y = 1 - 2 * (i + .5) / count;
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const ring = Math.sqrt(1 - y * y);
      const z = Math.sin(angle) * ring;
      return [Math.cos(angle) * ring * radius, y * radius, .52 + (z + 1) * .24];
    }
    const columns = 24;
    const column = i % columns / (columns - 1);
    const row = Math.floor(i / columns) / (count / columns - 1);
    const wave = settings.shape === 'Wave' ? Math.sin(column * 12 + row * 3) * .34 : 0;
    return [(column - .5) * radius * 2.65, (row - .5 + wave) * radius * 1.48, .86];
  }

  return {
    resize,
    reset() { pointer = undefined; lastShape = undefined; },
    draw(dt, reduced) {
      const {ctx, width, height} = surface;
      const key = settings.x + ':' + settings.y;
      if (key !== coordinates) { coordinates = key; pointer = undefined; }
      const [px, py] = pointer ?? [settings.x, settings.y];
      const radius = Math.min(height * .42, width * .32);
      const forceRadius = radius * .58;
      const force = settings.mode === 'Attract' ? -1 : 1;
      const blend = !lastShape || reduced || !dt ? 1 : 1 - Math.exp(-dt * 7);
      let moving = false;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#85e5ef';
      for (let i = 0; i < points.length; i++) {
        let [x, y, alpha] = target(i, points.length, radius);
        const dx = x - (px - .5) * width, dy = y - (py - .5) * height;
        const distance = Math.hypot(dx, dy);
        if (distance > .001 && distance < forceRadius) {
          const push = force * settings.strength * (1 - distance / forceRadius) ** 2 * radius * .34;
          x += dx / distance * push;
          y += dy / distance * push;
        }
        const point = points[i];
        point.x += (x - point.x) * blend;
        point.y += (y - point.y) * blend;
        moving ||= Math.abs(x - point.x) + Math.abs(y - point.y) > .12;
        ctx.globalAlpha = alpha;
        ctx.fillRect(width / 2 + point.x, height / 2 + point.y, 2.2, 2.2);
      }
      ctx.globalAlpha = 1;
      lastShape = settings.shape;
      return moving;
    }
  };
}
