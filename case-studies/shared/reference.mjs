import {resolveFrame,createDOMSheet} from './frame-style.mjs';
import {PROJECTS} from '../../data/projects.mjs';
import {layerProgress} from './layer-progress.mjs';
import {createTimeline} from './timeline.mjs';
import {createButtonProgress} from './button-progress.mjs';
import {CaseStudyEngine,DisplaySurface} from './engine.mjs';
const registry=await fetch(new URL('../config.json',import.meta.url)).then(r=>r.json());
const slug=new URLSearchParams(location.search).get('case')||document.documentElement.dataset.case||'jbl-artwork';
if(!Object.hasOwn(registry.projects,slug))throw new Error('Unknown case study');
const projectBase=new URL(`../projects/${slug}/`,import.meta.url);
const chapters=await fetch(new URL('chapters.json',projectBase)).then(r=>r.json());
const $=s=>document.querySelector(s),root=document.documentElement,section=$('#presentation'),motion=matchMedia('(prefers-reduced-motion: reduce)');
const shortViewport=matchMedia('(max-height:500px)');
let observer,images=[],manifest,selectedChapter=0,frameResize;const decoded=[],sheets=[];
if(new URLSearchParams(location.search).get('embedded')==='1')document.documentElement.classList.add('embedded-mode');
const {offsets,keyframes,annotationLayers,rotationAxis,perspective,leftLeanPixels,reclineDegrees,layerWindows}=await fetch(new URL('presentation.json',projectBase)).then(r=>r.json());
const timeline=createTimeline(keyframes);
let progress=0,sceneMode=new URLSearchParams(location.search).get('surface')==='showroom'&&parent!==window,sceneAnchors=[];
if(sceneMode)root.classList.add('scene-mode');
addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;if(e.data?.type==='case-study:anchors'&&Array.isArray(e.data.anchors)&&e.data.anchors.length===manifest?.layers.length&&e.data.anchors.every(point=>Number.isFinite(point?.x)&&Number.isFinite(point?.y))){sceneAnchors=e.data.anchors;drawLeaders(timeline.stateAt(progress));}if(e.data?.type==='case-study:fallback'){sceneMode=false;root.classList.remove('scene-mode');}});
const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.classList.add('leader');svg.setAttribute('aria-hidden','true');
const leaders=annotationLayers.map(()=>{
 const group=document.createElementNS(ns,'g'),path=document.createElementNS(ns,'path'),ring=document.createElementNS(ns,'circle'),dot=document.createElementNS(ns,'circle');
 path.setAttribute('pathLength','1');ring.setAttribute('r','9');ring.classList.add('anchor-ring');dot.setAttribute('r','4');dot.classList.add('anchor-dot');group.append(path,ring,dot);svg.append(group);return {group,path,ring,dot};
});$('.pin').append(svg);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function drawLeaders(state){
 const b=$('.chapter-content').getBoundingClientRect(),r=$('.pin').getBoundingClientRect();
 annotationLayers.forEach((active,i)=>{
  const index=manifest.layers.findIndex(layer=>layer.id===active.layer),marker=images[index]?.querySelector('.anchor'),line=leaders[i];
  if(!marker)return;
  const enter=i?smooth((progress-active.from+.035)/.07):1,next=annotationLayers[i+1];
  const leave=next?1-smooth((progress-next.from+.035)/.07):1,weight=enter*leave;
  const a=marker.getBoundingClientRect(),external=sceneMode?sceneAnchors[index]:null,x=(external?.x??a.left)-r.left,y=(external?.y??a.top)-r.top,tx=b.left-r.left-18,ty=r.height*.35;
  line.path.setAttribute('d',`M${x},${y} L${tx-24},${y} L${tx},${ty}`);
  for(const circle of [line.ring,line.dot]){circle.setAttribute('cx',x);circle.setAttribute('cy',y);}
  line.group.style.opacity=String(weight);line.path.style.strokeDashoffset=String(1-enter);
 });svg.style.opacity=String(state.spread*.85);
}

function render(state){
 if(sceneMode){const b=$('.visual').getBoundingClientRect();parent.postMessage({type:'case-study:progress',progress,rect:{x:b.x,y:b.y,width:b.width,height:b.height}},location.origin);}
 const board=$('.board'),depthScale=board.clientWidth/350;
 const lean=state.tilt/reclineDegrees;
 board.style.perspective=`${perspective}px`;
 const pose=`translate3d(${-leftLeanPixels*lean*depthScale}px,${state.lower*depthScale}px,0) rotate3d(${rotationAxis.join(',')},${state.tilt}deg)`;
 board.style.transform='none';
 images.forEach((im,i)=>{im.style.setProperty('--layer-shadow',String(state.spread*.24));im.style.setProperty('--frame-opacity',String(.18+.82*state.spread));const [x,y,z]=offsets[i],spread=layerProgress(layerWindows,state,progress,i);im.style.transform=`${pose} translate3d(${x*spread*depthScale}px,${y*spread*depthScale}px,${z*spread*depthScale}px)`;});
 $('.original').style.transform=`${pose} translateZ(3px)`;
 $('.original').style.opacity=state.original;
 drawLeaders(state);

}
const engine=new CaseStudyEngine({load:async()=>({validated:manifest.validated,timeline,chapters,surface:new DisplaySurface({snapshot:()=>({}),restore:()=>render(timeline.stateAt(0)),present:render,dispose(){}}),dispose(){frameResize?.disconnect();observer?.dispose();textAnimations.forEach(a=>a.cancel());}})});
let currentChapter=null,textAnimations=[];
function describe(p){
 const c=chapters.reduce((a,c)=>p>=c.progress-.06?c:a,chapters[0]);
 if(c.id===currentChapter)return;
 const animate=currentChapter!==null&&!motion.matches;currentChapter=c.id;
 textAnimations.forEach(a=>a.cancel());textAnimations=[];
 $('#counter').textContent=`0${chapters.indexOf(c)+1} / ${String(chapters.length).padStart(2,'0')}`;$('#chapter-title').textContent=c.title;$('#chapter-copy').textContent=c.copy;
 $('.source').textContent=c.source==='implementation'?'IMPLEMENTATION NOTE':'DESIGNER INTENT · OWNER NOTES';
 for(const b of $('#chapters').children)b.setAttribute('aria-current',String(b.dataset.id===c.id));
 $('#previous').disabled=selectedChapter===0;$('#next').disabled=selectedChapter===chapters.length-1;
 if(animate)for(const node of [$('#counter'),$('#chapter-title'),$('#chapter-copy'),$('.source')])textAnimations.push(node.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'}));
}
function goTo(index){selectedChapter=Math.max(0,Math.min(chapters.length-1,index));const chapter=chapters[selectedChapter];describe(chapter.progress);observer?.seek(chapter.progress);}
function setStatic(value){value=value||motion.matches||shortViewport.matches;$('#mode').disabled=motion.matches||shortViewport.matches;if(sceneMode)parent.postMessage({type:'case-study:pause',paused:value},location.origin);textAnimations.forEach(a=>a.cancel());textAnimations=[];section.hidden=value;observer?.dispose();observer=undefined;root.classList.toggle('is-static',value);$('#mode').textContent=$('#mode').disabled?'Static reading mode':value?'Interactive presentation':'Static chapters';if(!value){observer=createButtonProgress(p=>{progress=p;engine.seek(p);});goTo(selectedChapter);}}
const aside=$('aside'),content=document.createElement('div');content.className='chapter-content';
for(const node of [...aside.children])if(node!==$('#chapters'))content.append(node);aside.append(content);$('.pin').append($('#chapters'));
const actions=document.createElement('div');actions.className='chapter-actions';
for(const [id,label] of [['previous','Previous'],['next','Next']]){const b=document.createElement('button');b.type='button';b.id=id;b.className='case-action case-action--'+id;b.textContent=label;b.onclick=()=>goTo(selectedChapter+(id==='next'?1:-1));actions.append(b);}
content.insertBefore(actions,$('#replay'));$('#chapter-title').setAttribute('aria-live','polite');$('#chapter-title').setAttribute('aria-atomic','true');
for(const c of chapters){const b=document.createElement('button');b.type='button';b.dataset.id=c.id;b.setAttribute('aria-label',c.title);b.onclick=()=>goTo(chapters.indexOf(c));$('#chapters').append(b);}
$('#chapters').addEventListener('keydown',e=>{const index=[...$('#chapters').children].indexOf(e.target);if(index<0)return;let next=index;if(e.key==='ArrowDown')next++;else if(e.key==='ArrowUp')next--;else if(e.key==='Home')next=0;else if(e.key==='End')next=chapters.length-1;else return;e.preventDefault();goTo(next);$('#chapters').children[selectedChapter].focus();});
try{
 manifest=await fetch(new URL('manifest.json',projectBase)).then(r=>{if(!r.ok)throw Error('Manifest unavailable');return r.json();});
 if(!manifest.validated)throw Error('Layer validation incomplete');$('.board').style.aspectRatio=manifest.canvas[0]+'/'+manifest.canvas[1];if(manifest.accent)root.style.setProperty('--accent',manifest.accent);root.style.setProperty('--control-accent',PROJECTS.find(project=>project.id===slug)?.accent||manifest.accent||'#00f0ff');if(manifest.original)$('.original').src=new URL(manifest.original,projectBase).href;
 for(const l of manifest.layers){const im=new Image();im.src=new URL(l.src,projectBase);im.alt='';await im.decode();decoded.push(im);const plane=document.createElement('div');plane.className='plane';const marker=document.createElement('i');marker.className='anchor';const [x,y,w,h]=[l.bbox[0],l.bbox[1],l.bbox[2]-l.bbox[0],l.bbox[3]-l.bbox[1]];marker.style.left=`${(x+w/2)/manifest.canvas[0]*100}%`;marker.style.top=`${(y+h/2)/manifest.canvas[1]*100}%`;plane.style.backgroundImage=`url("${im.src}")`;plane.append(marker);$('.board').append(plane);images.push(plane);}
 const frameStyle=resolveFrame(manifest,[decoded[0],decoded.at(-1)]);images.forEach((plane,i)=>sheets.push(createDOMSheet(plane,decoded[i],frameStyle)));frameResize=new ResizeObserver(()=>{const board=$('.board');sheets.forEach(sheet=>sheet.resize(board.clientWidth,board.clientHeight));});frameResize.observe($('.board'));
 await engine.open(slug);root.classList.add('motion-ready');$('#mode').hidden=false;$('#loading').textContent='Use Previous and Next to explore the layers';setStatic(motion.matches);describe(0);
 $('#mode').onclick=()=>setStatic(!root.classList.contains('is-static')||motion.matches);
 $('#replay').onclick=()=>goTo(0);
 motion.addEventListener('change',()=>setStatic(motion.matches||shortViewport.matches));shortViewport.addEventListener('change',()=>setStatic(motion.matches||shortViewport.matches));
 addEventListener('keydown',e=>{if(e.key==='Escape')$('#exit').click();});
 addEventListener('pagehide',()=>engine.close(),{once:true});
}catch(error){$('#loading').textContent='Presentation unavailable. Read the chapters below.';root.classList.add('is-static');$('#mode').hidden=true;}

if(new URLSearchParams(location.search).get('embedded')==='1'&&parent!==window){if(!sceneMode)$('#exit').textContent='← Back to project';$('#exit').onclick=e=>{e.preventDefault();parent.postMessage({type:'case-study:close'},location.origin);};}
