import {createTimeline} from './timeline.mjs';
import {observeProgress} from './progress.mjs';
import {CaseStudyEngine,DisplaySurface} from './engine.mjs';
const registry=await fetch(new URL('../config.json',import.meta.url)).then(r=>r.json());
const slug=new URLSearchParams(location.search).get('case')||'jbl-artwork';
if(!Object.hasOwn(registry.projects,slug))throw new Error('Unknown case study');
const projectBase=new URL(`../projects/${slug}/`,import.meta.url);
const chapters=await fetch(new URL('chapters.json',projectBase)).then(r=>r.json());
const $=s=>document.querySelector(s),root=document.documentElement,section=$('#presentation'),motion=matchMedia('(prefers-reduced-motion: reduce)');
let observer,images=[],manifest;
const {offsets,keyframes,annotationLayers,rotationAxis,perspective,leftLeanPixels}=await fetch(new URL('presentation.json',projectBase)).then(r=>r.json());
const timeline=createTimeline(keyframes);
let progress=0;
const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),leader=document.createElementNS(ns,'path');svg.classList.add('leader');svg.setAttribute('aria-hidden','true');svg.append(leader);$('.pin').append(svg);
function render(state){
 const board=$('.board'),depthScale=board.clientWidth/350;
 const lean=state.tilt/48;
 board.style.perspective=`${perspective}px`;
 const pose=`translate3d(${-leftLeanPixels*lean*depthScale}px,${state.lower*depthScale}px,0) rotate3d(${rotationAxis.join(',')},${state.tilt}deg)`;
 board.style.transform='none';
 images.forEach((im,i)=>{const [x,y,z]=offsets[i];im.style.transform=`${pose} translate3d(${x*state.spread*depthScale}px,${y*state.spread*depthScale}px,${z*state.spread*depthScale}px)`;});
 $('.original').style.transform=`${pose} translateZ(3px)`;
 $('.original').style.opacity=state.original;
 const active=annotationLayers.reduce((a,c)=>progress>=c.from?c:a,annotationLayers[0]);
 const index=manifest.layers.findIndex(layer=>layer.id===active.layer);
 const marker=images[index]?.querySelector('.anchor');
 if(marker){const a=marker.getBoundingClientRect(),b=$('#chapter-title').getBoundingClientRect(),r=$('.pin').getBoundingClientRect();const x=a.left-r.left,y=a.top-r.top,tx=b.left-r.left-18,ty=b.top-r.top+b.height/2;leader.setAttribute('d',`M${x},${y} L${tx-24},${y} L${tx},${ty}`);svg.style.opacity=String(state.spread*.6);}

}
const engine=new CaseStudyEngine({load:async()=>({validated:manifest.validated,timeline,chapters,surface:new DisplaySurface({snapshot:()=>({}),restore:()=>render(timeline.stateAt(0)),present:render,dispose(){}}),dispose(){observer?.dispose();}})});
function describe(p){const c=chapters.reduce((a,c)=>p>=c.progress-.06?c:a,chapters[0]);$('#counter').textContent=`0${chapters.indexOf(c)+1} / ${String(chapters.length).padStart(2,'0')}`;$('#chapter-title').textContent=c.title;$('#chapter-copy').textContent=c.copy;$('.source').textContent=c.source==='implementation'?'IMPLEMENTATION NOTE':'DESIGNER INTENT · OWNER NOTES';for(const b of $('#chapters').children)b.setAttribute('aria-current',String(b.dataset.id===c.id));}
function setStatic(value){section.hidden=value;observer?.dispose();observer=undefined;root.classList.toggle('is-static',value);$('#mode').textContent=value?'Scroll presentation':'Static chapters';if(!value)observer=observeProgress(section,p=>{progress=p;engine.seek(p);describe(p);});}
for(const c of chapters){const b=document.createElement('button');b.textContent=String(chapters.indexOf(c)+1);b.dataset.id=c.id;b.setAttribute('aria-label',c.title);b.onclick=()=>observer?.seek(c.progress);$('#chapters').append(b);}
try{
 manifest=await fetch(new URL('manifest.json',projectBase)).then(r=>{if(!r.ok)throw Error('Manifest unavailable');return r.json();});
 if(!manifest.validated)throw Error('Layer validation incomplete');
 for(const l of manifest.layers){const im=new Image();im.src=new URL(l.src,projectBase);im.alt='';await im.decode();const plane=document.createElement('div');plane.className='plane';const marker=document.createElement('i');marker.className='anchor';const [x,y,w,h]=[l.bbox[0],l.bbox[1],l.bbox[2]-l.bbox[0],l.bbox[3]-l.bbox[1]];marker.style.left=`${(x+w/2)/manifest.canvas[0]*100}%`;marker.style.top=`${(y+h/2)/manifest.canvas[1]*100}%`;plane.style.backgroundImage=`url("${im.src}")`;plane.append(marker);$('.board').append(plane);images.push(plane);}
 await engine.open(slug);root.classList.add('motion-ready');$('#mode').hidden=false;$('#loading').textContent='Scroll to separate the original layers';setStatic(motion.matches);describe(0);
 $('#mode').onclick=()=>setStatic(!root.classList.contains('is-static')||motion.matches);
 $('#replay').onclick=()=>observer?.seek(0);
 motion.addEventListener('change',()=>setStatic(motion.matches));
 addEventListener('keydown',e=>{if(e.key==='Escape')$('#exit').click();});
 addEventListener('pagehide',()=>engine.close(),{once:true});
}catch(error){$('#loading').textContent='Presentation unavailable. Read the chapters below.';root.classList.add('is-static');$('#mode').hidden=true;}

if(new URLSearchParams(location.search).get('embedded')==='1'&&parent!==window){$('#exit').onclick=e=>{e.preventDefault();parent.postMessage({type:'case-study:close'},location.origin);};}
