import {canvas2d} from './runtime.js';

// Exact unit-mass step response to x'' + c*x' + k*(x-1) = 0.
export function spring(t, stiffness, damping) {
  const half = damping / 2;
  const discriminant = stiffness - half * half;
  if (Math.abs(discriminant) < .00001) return 1 - Math.exp(-half * t) * (1 + half * t);
  if (discriminant > 0) {
    const frequency = Math.sqrt(discriminant);
    return 1 - Math.exp(-half * t) * (Math.cos(frequency * t) + half * Math.sin(frequency * t) / frequency);
  }
  const root = Math.sqrt(-discriminant);
  const first = -half + root;
  const second = -half - root;
  return 1 + (second * Math.exp(first * t) - first * Math.exp(second * t)) / (first - second);
}

export function mount(api) {
  const surface = canvas2d(api, 'Time versus position curves and synchronized markers for spring and cubic easing');
  const settings = api.settings;
  const duration = 3.8;
  let time = 0;
  return {
    resize: surface.resize,
    reset() { time = 0; },
    draw(dt, reduced) {
      const {ctx, width, height} = surface;
      time = reduced ? duration : Math.min(duration, time + dt);
      const left = 24, right = width - 24, top = 18, bottom = height * .64;
      const x = t => left + t / duration * (right - left);
      const y = p => bottom - p / 1.85 * (bottom - top);
      const curves = [
        {color: '#6ae9f8', at: t => spring(t, settings.stiffness, settings.damping)},
        {color: '#d0bcff', at: t => 1 - (1 - Math.min(1, t / settings.duration)) ** 3}
      ];
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = '#35475b';
      for (const value of [0, .5, 1, 1.5]) {
        ctx.beginPath();
        ctx.moveTo(left, y(value));
        ctx.lineTo(right, y(value));
        ctx.stroke();
      }
      for (const [index, curve] of curves.entries()) {
        ctx.strokeStyle = curve.color;
        ctx.fillStyle = curve.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(left, y(0));
        for (let step = 1; step <= 120; step++) {
          const t = duration * step / 120;
          ctx.lineTo(x(t), y(curve.at(t)));
        }
        ctx.stroke();
        const position = curve.at(time);
        ctx.beginPath();
        ctx.arc(x(time), y(position), 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(left, height * (.76 + index * .14), Math.min(1.85, position) / 1.85 * (right - left), 5);
      }
      return time < duration;
    }
  };
}
