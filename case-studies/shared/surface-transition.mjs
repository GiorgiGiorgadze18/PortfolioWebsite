import {createTimeline} from './timeline.mjs';
// The existing showroom loop owns tick(); this module never starts another rAF.
export function createSurfaceTransition({capture,apply,reduced=()=>false,clock=()=>performance.now()}){
 let original=null,animation=null,status='idle';
 function animate(to,nextStatus){
  if(animation){animation.resolve(false);animation=null;}
  const from=capture();
  return new Promise(resolve=>{
   animation={timeline:createTimeline([{p:0,ease:'inOutCubic',state:from},{p:1,state:to}]),start:clock(),duration:reduced()?0:600,to,nextStatus,resolve};status=nextStatus==='active'?'entering':'exiting';
   if(reduced())tick(clock());
  });
 }
 function tick(now){if(!animation)return;const a=animation,p=a.duration?Math.min(1,Math.max(0,(now-a.start)/a.duration)):1;apply(a.timeline.stateAt(p));if(p===1){animation=null;status=a.nextStatus;if(status==='idle')original=null;a.resolve(true);}}
 return {
  get status(){return status;},get busy(){return Boolean(animation);},
  inspect:()=>({status,pose:capture()}),tick,
  enter({holdPose=false}={}){if(status!=='idle')return Promise.resolve(false);original=structuredClone(capture());if(holdPose){status='active';return Promise.resolve(true);}const pose=structuredClone(original);pose.position[1]+=.16;pose.position[2]+=.25;pose.camera[2]-=.2;pose.rotation[0]-=.10;return animate(pose,'active');},
  exit(){if(!original)return Promise.resolve(false);return animate(structuredClone(original),'idle');},
  dispose(){if(animation)animation.resolve(false);animation=null;if(original)apply(original);original=null;status='idle';},
 };
}
