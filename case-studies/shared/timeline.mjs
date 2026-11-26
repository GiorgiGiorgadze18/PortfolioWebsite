// Pure numeric keyframe sampling; author complete state snapshots, never deltas.
export const clamp01 = value => Math.min(1, Math.max(0, value));
export const easings = Object.freeze({
 linear: t => t,
 inOutCubic: t => t < .5 ? 4*t*t*t : 1-(-2*t+2)**3/2,
 outCubic: t => 1-(1-t)**3,
});
function interpolate(a, b, t) {
 if (typeof a === 'number' && typeof b === 'number') return a+(b-a)*t;
 if (Array.isArray(a) && Array.isArray(b) && a.length === b.length)
  return a.map((value, i) => interpolate(value,b[i],t));
 if (a && b && typeof a === 'object' && typeof b === 'object') {
  const keys=Object.keys(a);
  if (keys.length !== Object.keys(b).length || keys.some(key => !(key in b)))
   throw new TypeError('Keyframes must have matching state keys');
  return Object.fromEntries(keys.map(key => [key,interpolate(a[key],b[key],t)]));
 }
 return structuredClone(t < 1 ? a : b);
}
export function createTimeline(keyframes) {
 if (!Array.isArray(keyframes) || keyframes.length < 2) throw new TypeError('At least two keyframes required');
 const frames=structuredClone(keyframes);
 frames.forEach((frame,i) => {
  if (!Number.isFinite(frame.p) || frame.p < 0 || frame.p > 1 || (i && frame.p <= frames[i-1].p))
   throw new TypeError('Progress must be finite, ordered and in range');
  if (!easings[frame.ease || 'linear']) throw new TypeError('Unknown easing');
  if (i) interpolate(frames[i-1].state,frame.state,.5);
 });
 if (frames[0].p !== 0 || frames.at(-1).p !== 1) throw new TypeError('Timeline must cover 0 through 1');
 return Object.freeze({stateAt(progress) {
  if (!Number.isFinite(progress)) throw new TypeError('Finite progress required');
  const p=clamp01(progress);
  if (p===1) return structuredClone(frames.at(-1).state);
  const i=frames.findIndex((frame,index) => index < frames.length-1 && p >= frame.p && p < frames[index+1].p);
  const a=frames[i],b=frames[i+1];
  return interpolate(a.state,b.state,easings[a.ease || 'linear']((p-a.p)/(b.p-a.p)));
 }});
}
// Exact critically damped spring solution over dt, independent of refresh rate.
export function advanceSpring(position, velocity, target, dt, omega=10) {
 if (![position,velocity,target,dt,omega].every(Number.isFinite) || dt<0 || omega<=0)
  throw new TypeError('Invalid spring parameters');
 const offset=position-target, c=velocity+omega*offset, decay=Math.exp(-omega*dt);
 return {position:target+(offset+c*dt)*decay,velocity:(velocity-omega*c*dt)*decay};
}
