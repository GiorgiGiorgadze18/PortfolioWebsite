import {advanceSpring,clamp01} from './timeline.mjs';
// On-demand, interruptible chapter progress; scrolling never changes the target.
export function createButtonProgress(update,{motion=matchMedia('(prefers-reduced-motion: reduce)')}={}){
 const abort=new AbortController();let raf=0,last=0,p=0,v=0,target=0;
 function schedule(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
 function frame(now){raf=0;if(document.hidden)return;const dt=last?Math.min(.1,(now-last)/1000):1/60;last=now;
  if(motion.matches){p=target;v=0;}else {const next=advanceSpring(p,v,target,dt);p=next.position;v=next.velocity;}
  if(Math.abs(p-target)<.0001&&Math.abs(v)<.0001){p=target;v=0;last=0;}else schedule();
  update(clamp01(p));
 }
 document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule();},{signal:abort.signal});
 addEventListener('resize',schedule,{passive:true,signal:abort.signal});motion.addEventListener('change',schedule,{signal:abort.signal});
 schedule();return {seek(value){target=clamp01(value);schedule();},dispose(){abort.abort();cancelAnimationFrame(raf);raf=0;}};
}
