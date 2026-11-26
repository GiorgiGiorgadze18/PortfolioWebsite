import {showroomBridge} from './showroom-bridge.mjs';
// Review-only; opening this entry does not publish the project.
if(new URLSearchParams(location.search).get('caseStudyPreview')==='1'){
 const inspector=document.querySelector('#project-inspector'),title=document.querySelector('#inspector-title');
 const trigger=document.createElement('button');trigger.type='button';trigger.className='text-control';trigger.textContent='Explore case study · Preview';trigger.hidden=true;inspector.append(trigger);
 const update=()=>{trigger.hidden=title.textContent!=='JBL Premium Audio Campaign';};new MutationObserver(update).observe(title,{childList:true,subtree:true,characterData:true});update();
 let dialog,frame,oldOverflow,opening=false,closing=false,generation=0;
 async function close(){
  if(closing||(!opening&&!dialog?.open))return;closing=true;++generation;opening=false;
  if(dialog?.open){dialog.close();frame?.remove();}
  document.documentElement.removeAttribute('data-case-study-active');
  await showroomBridge?.exit();
  document.documentElement.style.overflow=oldOverflow;trigger.disabled=false;closing=false;(inspector.inert?document.querySelector('[data-project-view=grid]'):trigger).focus({preventScroll:true});
 }
 trigger.onclick=async()=>{
  if(opening||closing||dialog?.open)return;
  const token=++generation;opening=true;trigger.disabled=true;oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
  const entered=await showroomBridge?.enter();
  if(token!==generation)return;
  if(!entered){opening=false;trigger.disabled=false;document.documentElement.style.overflow=oldOverflow;return;}
  if(!dialog){dialog=document.createElement('dialog');dialog.setAttribute('aria-label','JBL composition study');dialog.style.cssText='width:100vw;max-width:100vw;height:100svh;max-height:100svh;padding:0;border:0;background:#080d18';document.body.append(dialog);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});}
  frame=document.createElement('iframe');frame.title='JBL composition study';frame.src='case-studies/jbl-preview.html?embedded=1';frame.style.cssText='width:100%;height:100%;border:0';dialog.append(frame);document.documentElement.dataset.caseStudyActive='true';opening=false;dialog.showModal();
 };
 addEventListener('keydown',e=>{if(e.key==='Escape'&&opening){e.preventDefault();close();}},{capture:true});
 addEventListener('message',e=>{if(e.origin===location.origin&&e.source===frame?.contentWindow&&e.data?.type==='case-study:close')close();});
}
