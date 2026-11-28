import {showroomBridge} from './showroom-bridge.mjs';

const registry=await fetch(new URL('../config.json',import.meta.url)).then(response=>response.json());
const projects=registry.projects;
const inspector=document.querySelector('#project-inspector');
const title=document.querySelector('#inspector-title');
const buttons=inspector.querySelector('.inspector-buttons');
const trigger=document.createElement('button');
trigger.type='button';
trigger.className='case-about';
trigger.textContent='About';
trigger.hidden=true;
trigger.dataset.caseScene='';
buttons.prepend(trigger);

const dialog=document.createElement('dialog');
dialog.className='case-study-dialog';
dialog.setAttribute('aria-label','Project composition study');
dialog.innerHTML='<div class="case-preparing"><p role="status">Preparing composition</p><button type="button">Quit</button></div>';
document.body.append(dialog);
const loading=dialog.querySelector('.case-preparing');
loading.querySelector('button').addEventListener('click',close);
dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
dialog.addEventListener('click',event=>{if(event.target===dialog)close();});

let frame, session, closing=false;
const root=document.documentElement;
const findSlug=name=>Object.keys(projects).find(slug=>projects[slug].published&&projects[slug].title===name);

function reveal(active){
 if(session!==active||!active.ready||!active.layersReady)return;
 dialog.classList.add('is-ready');
 frame.inert=false;
 frame.focus({preventScroll:true});
 frame.contentWindow.postMessage({type:'case-study:visible'},location.origin);
}

async function close(){
 if(!session||closing)return;
 closing=true;
 const active=session;
 session=null;
 active.abort.abort();
 delete root.dataset.caseStudyActive;
 delete root.dataset.caseStudyPaused;
 delete root.dataset.caseStudyScene;
 dialog.close();
 frame.remove();
 if(active.scene)await showroomBridge?.exit();
 root.style.overflow=active.overflow;
 active.museum.style.minHeight=active.museumMinHeight;
 window.scrollTo({top:active.scrollY,behavior:'instant'});
 closing=false;
 const control=active.trigger===trigger&&(inspector.inert||trigger.hidden)
  ? document.querySelector('[data-project-view=grid]') : active.trigger;
 requestAnimationFrame(()=>requestAnimationFrame(()=>control.focus({preventScroll:true})));
}

function setFrameSource(active,scene){
 active.ready=false;
 frame.inert=true;
 frame.src='case-studies/'+projects[active.slug].preview+'?embedded=1&case='+
  encodeURIComponent(active.slug)+(scene?'&surface=showroom':'')+'&v=20261128-motion';
}

async function useGridFallback(active){
 if(session!==active)return;
 active.abort.abort();
 active.scene=false;
 delete root.dataset.caseStudyScene;
 delete root.dataset.caseStudyPaused;
 dialog.classList.remove('is-scene','is-ready');
 await showroomBridge?.exit();
 if(session!==active)return;
 active.layersReady=true;
 setFrameSource(active,false);
}

async function open(useScene,button,slug){
 if(session||closing||!projects[slug]?.published)return;
 const museum=document.querySelector('.museum-section');
 const active={slug,trigger:button,scene:useScene,overflow:root.style.overflow,
  scrollY:window.scrollY,museum,museumMinHeight:museum.style.minHeight,
  abort:new AbortController(),ready:false,layersReady:!useScene};
 session=active;
 root.style.overflow='hidden';
 root.dataset.caseStudyActive='true';
 dialog.classList.toggle('is-scene',useScene);
 dialog.classList.remove('is-ready');
 frame=document.createElement('iframe');
 frame.title=projects[slug].shortTitle+' composition study';
 setFrameSource(active,useScene);
 dialog.append(frame);
 dialog.showModal();
 loading.querySelector('button').focus({preventScroll:true});
 if(!useScene)return;
 // Allow the preparation UI to paint before decoding and uploading artwork.
 await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 if(session!==active)return;
 try{
  if(!await showroomBridge?.enter(slug))throw Error('Showroom not ready');
  await showroomBridge.loadLayers(active.abort.signal);
  if(session!==active)return;
  // Keep the page height while the showroom canvas temporarily leaves document flow.
  museum.style.minHeight=museum.offsetHeight+'px';
  root.dataset.caseStudyScene='true';
  active.layersReady=true;
  reveal(active);
 }catch{
  await useGridFallback(active);
 }
}

document.addEventListener('click',event=>{
 const control=event.target.closest('[data-explore]');
 const slug=control?.dataset.explore;
 if(!projects[slug]?.published)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 open(false,control,slug);
},true);

function appId(){
 return {'MeeTab':'jbl','Tsero App':'tsero'}[title.textContent.trim()];
}
trigger.addEventListener('click',()=>{
 const slug=findSlug(title.textContent);
 if(slug)open(true,trigger,slug);
 else if(appId()){
  trigger.focus({preventScroll:true});
  document.dispatchEvent(new CustomEvent('portfolio:show-project-details',{detail:appId()}));
 }
});
function update(){
 trigger.hidden=!(findSlug(title.textContent)||appId());
 buttons.classList.toggle('has-case-study',!trigger.hidden);
 const modal=document.querySelector('.mobile-project-dialog[open]');
 const slug=findSlug(modal?.querySelector('h2')?.textContent);
 const existing=modal?.querySelector('[data-case-grid]');
 if(existing)existing.hidden=!slug;
 else if(slug){
  const button=document.createElement('button');
  button.type='button';
  button.dataset.caseGrid='';
  button.className='mobile-dialog-link';
  button.textContent='About';
  button.onclick=()=>open(false,button,findSlug(modal.querySelector('h2').textContent));
  modal.querySelector('.mobile-project-inner').append(button);
 }
}
new MutationObserver(update).observe(title,{childList:true,subtree:true,characterData:true});
document.addEventListener('portfolio:project-details-opened',update);
update();

addEventListener('message',event=>{
 const active=session;
 if(!active||event.origin!==location.origin||event.source!==frame.contentWindow)return;
 const {type,progress,rect,paused}=event.data??{};
 if(type==='case-study:ready'){
  active.ready=true;
  reveal(active);
 }

 if(type==='case-study:close')close();
 if(type==='case-study:pause'&&active.scene&&typeof paused==='boolean'){
  if(paused)root.dataset.caseStudyPaused='true';
  else delete root.dataset.caseStudyPaused;
 }
 if(type==='case-study:progress'&&active.scene&&active.layersReady&&dialog.classList.contains('is-ready')){
  if(!Number.isFinite(progress)||progress<0||progress>1||!rect||
   !['x','y','width','height'].every(key=>Number.isFinite(rect[key]))||
   rect.width<=0||rect.height<=0||rect.width>innerWidth*2||rect.height>innerHeight*2||
   Math.abs(rect.x)>innerWidth*2||Math.abs(rect.y)>innerHeight*2)return;
  showroomBridge?.setProgress(progress,rect);
 }
});
addEventListener('case-study:anchors',event=>{
 if(session?.scene&&dialog.classList.contains('is-ready')){
  frame.contentWindow.postMessage({type:'case-study:anchors',anchors:event.detail},location.origin);
 }
});
addEventListener('case-study:fallback',()=>{if(session?.scene)useGridFallback(session);});
