import {showroomBridge} from './showroom-bridge.mjs';
if(new URLSearchParams(location.search).get('caseStudyPreview')==='1'){
 const registry=await fetch(new URL('../config.json',import.meta.url)).then(r=>r.json());
 const findSlug=name=>Object.keys(registry.projects).find(slug=>registry.projects[slug].title===name);
 const inspector=document.querySelector('#project-inspector'),title=document.querySelector('#inspector-title');
 const trigger=document.createElement('button');trigger.type='button';trigger.className='text-control';trigger.textContent='Explore case study · Preview';trigger.hidden=true;trigger.dataset.caseScene='';inspector.querySelector('.inspector-buttons').append(trigger);
 let dialog,frame,returnTrigger=trigger,oldOverflow,opening=false,closing=false,generation=0,scene=false,returnLabel='';
 const style=document.createElement('style');style.textContent=`html[data-case-study-scene] #museum-frame{position:fixed!important;inset:0!important;width:100vw!important;height:100svh!important;margin:0!important;z-index:90;background:#060A14!important}html[data-case-study-scene] #museum-frame>:not(#showroom-canvas):not(#focus-canvas),html[data-case-study-scene] #museum-frame>:not(#showroom-canvas):not(#focus-canvas) *{visibility:hidden!important}.case-study-dialog::backdrop{background:transparent}.inspector-buttons.has-case-study{display:flex;flex-wrap:wrap;gap:8px}.inspector-buttons [data-case-scene]{width:100%;min-height:44px}`;document.head.append(style);
 async function close(){
  if(closing||(!opening&&!dialog?.open))return;closing=true;++generation;opening=false;
  if(dialog?.open){dialog.close();frame?.remove();}
  document.documentElement.removeAttribute('data-case-study-active');document.documentElement.removeAttribute('data-case-study-scene');document.documentElement.removeAttribute('data-case-study-paused');
  if(scene)await showroomBridge?.exit();scene=false;
  document.documentElement.style.overflow=oldOverflow;returnTrigger.disabled=false;returnTrigger.textContent=returnLabel;closing=false;(returnTrigger===trigger&&inspector.inert?document.querySelector('[data-project-view=grid]'):returnTrigger).focus({preventScroll:true});
 }
 async function open(useScene,button,slug){
  if(!slug)return;const project=registry.projects[slug];
  if(opening||closing||dialog?.open)return;
  const token=++generation;opening=true;scene=useScene;returnTrigger=button;returnLabel=button.textContent;button.textContent='Loading case study…';button.disabled=true;oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
  if(scene){const entered=await showroomBridge?.enter(slug);if(token!==generation)return;if(!entered){opening=false;button.disabled=false;button.textContent=returnLabel;document.documentElement.style.overflow=oldOverflow;return;}
   try{await showroomBridge.loadLayers();}catch{await showroomBridge.exit();scene=false;}
   if(token!==generation){await showroomBridge?.exit();return;}
  }
  if(!dialog){dialog=document.createElement('dialog');dialog.className='case-study-dialog';dialog.setAttribute('aria-label','Project composition study');dialog.style.cssText='width:100vw;max-width:100vw;height:100svh;max-height:100svh;padding:0;border:0';document.body.append(dialog);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});}
  dialog.style.background=scene?'transparent':'#080d18';
  frame=document.createElement('iframe');frame.title=project.shortTitle+' composition study';frame.src='case-studies/'+project.preview+'?embedded=1&case='+encodeURIComponent(slug)+(scene?'&surface=showroom':'');frame.style.cssText='width:100%;height:100%;border:0;background:transparent';dialog.append(frame);
  document.documentElement.dataset.caseStudyActive='true';if(scene)document.documentElement.dataset.caseStudyScene='true';opening=false;dialog.showModal();
 }
 trigger.onclick=()=>open(true,trigger,findSlug(title.textContent));
 const update=()=>{
  trigger.hidden=!findSlug(title.textContent);inspector.querySelector('.inspector-buttons').classList.toggle('has-case-study',!trigger.hidden);
  const modal=document.querySelector('.mobile-project-dialog[open]');
  if(findSlug(modal?.querySelector('h2')?.textContent)&&!modal.querySelector('[data-case-grid]')){
   const b=document.createElement('button');b.type='button';b.dataset.caseGrid='';b.className='mobile-dialog-link';b.textContent='Explore case study · Preview';b.onclick=()=>open(false,b,findSlug(modal.querySelector('h2').textContent));modal.querySelector('.mobile-project-inner').append(b);
  }
 };new MutationObserver(update).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['open']});update();
 addEventListener('keydown',e=>{if(e.key==='Escape'&&opening){e.preventDefault();close();}},{capture:true});
 addEventListener('message',e=>{
  if(e.origin!==location.origin||e.source!==frame?.contentWindow)return;
  if(e.data?.type==='case-study:close'){close();return;}
  if(e.data?.type==='case-study:pause'&&scene&&typeof e.data.paused==='boolean'){if(e.data.paused)document.documentElement.dataset.caseStudyPaused='true';else document.documentElement.removeAttribute('data-case-study-paused');}
  if(e.data?.type==='case-study:progress'&&scene){const {progress,rect}=e.data;
   if(!Number.isFinite(progress)||progress<0||progress>1||!rect||!['x','y','width','height'].every(k=>Number.isFinite(rect[k]))||rect.width<=0||rect.height<=0||rect.width>innerWidth*2||rect.height>innerHeight*2||Math.abs(rect.x)>innerWidth*2||Math.abs(rect.y)>innerHeight*2)return;
   showroomBridge?.setProgress(progress,rect);
  }
 });
 addEventListener('case-study:anchors',e=>{if(scene&&dialog?.open)frame.contentWindow.postMessage({type:'case-study:anchors',anchors:e.detail},location.origin);});
 addEventListener('case-study:fallback',()=>{if(scene&&frame){scene=false;document.documentElement.removeAttribute('data-case-study-scene');dialog.style.background='#080d18';frame.contentWindow.postMessage({type:'case-study:fallback'},location.origin);}});
}
