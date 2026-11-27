import assert from 'node:assert/strict';
import {createButtonProgress} from '../../case-studies/shared/button-progress.mjs';
const events=new EventTarget(),doc=new EventTarget();doc.hidden=false;globalThis.document=doc;globalThis.addEventListener=events.addEventListener.bind(events);
let seq=0,now=0;const pending=new Map();globalThis.requestAnimationFrame=fn=>{pending.set(++seq,fn);return seq;};globalThis.cancelAnimationFrame=id=>pending.delete(id);
const motion=new EventTarget();motion.matches=false;const values=[];const source=createButtonProgress(p=>values.push(p),{motion});
function frames(n){for(let i=0;i<n;i++){now+=1000/60;const work=[...pending.values()];pending.clear();work.forEach(fn=>fn(now));assert.ok(pending.size<=1,'at most one owned animation frame');}}
source.seek(.8);frames(12);const high=values.at(-1);assert.ok(high>0&&high<.8);source.seek(.2);frames(120);assert.equal(values.at(-1),.2);assert.equal(pending.size,0,'settled source stops');
source.seek(1);doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(pending.size,0);const count=values.length;events.dispatchEvent(new Event('resize'));frames(10);assert.equal(values.length,count);
doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));frames(120);assert.equal(values.at(-1),1);
motion.matches=true;source.seek(.4);frames(1);assert.equal(values.at(-1),.4);source.dispose();events.dispatchEvent(new Event('resize'));motion.dispatchEvent(new Event('change'));assert.equal(pending.size,0);
console.log('PASS interrupt/reverse, settled-loop stop, hidden pause/resume, reduced motion and listener disposal');
