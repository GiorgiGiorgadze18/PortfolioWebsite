import {advanceSpring,clamp01} from './timeline.mjs';
// One owned animation loop; native scroll remains the only scrolling mechanism.
export function observeProgress(section, update, {motion=matchMedia('(prefers-reduced-motion: reduce)')}={}) {
 const abort=new AbortController();let raf=0,last=0,p=0,v=0,target=0,visible=true;
 const read=()=>{const r=section.getBoundingClientRect();target=clamp01(-r.top/Math.max(1,r.height-innerHeight));schedule();};
 function frame(now){raf=0;if(document.hidden||!visible)return;const dt=last?Math.min(.1,(now-last)/1000):1/60;last=now;
  if(motion.matches){p=target;v=0;}else {const next=advanceSpring(p,v,target,dt);p=next.position;v=next.velocity;}
  update(clamp01(p));if(Math.abs(p-target)>.0001||Math.abs(v)>.0001)schedule();else last=0;
 }
 function schedule(){if(!raf&&!document.hidden&&visible)raf=requestAnimationFrame(frame);}
 const options={passive:true,signal:abort.signal};
 addEventListener('scroll',read,options);addEventListener('resize',read,options);
 document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else read();},{signal:abort.signal});
 motion.addEventListener('change',read,{signal:abort.signal});
 const observer=new IntersectionObserver(entries=>{visible=entries.at(-1).isIntersecting;if(visible)read();else {cancelAnimationFrame(raf);raf=0;last=0;}});observer.observe(section);read();
 return {seek(value){const r=section.getBoundingClientRect();scrollTo({top:scrollY+r.top+clamp01(value)*Math.max(1,r.height-innerHeight),behavior:'instant'});read();},dispose(){abort.abort();observer.disconnect();cancelAnimationFrame(raf);}};
}
