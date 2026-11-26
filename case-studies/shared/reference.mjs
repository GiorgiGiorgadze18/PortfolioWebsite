import {createTimeline} from './timeline.mjs';
import {observeProgress} from './progress.mjs';
import {CaseStudyEngine,DisplaySurface} from './engine.mjs';
const chapters=await fetch(new URL('../projects/jbl-artwork/chapters.json',import.meta.url)).then(r=>r.json());
const $=s=>document.querySelector(s),root=document.documentElement,section=$('#presentation'),motion=matchMedia('(prefers-reduced-motion: reduce)');
let observer,images=[],manifest;
const offsets=[[-16,0,-40],[0,45,35],[22,-10,180],[0,10,115],[22,-10,180],[14,-35,235]];
const timeline=createTimeline([{p:0,state:{spread:0,angle:0,original:1}},{p:.12,state:{spread:0,angle:0,original:0}},{p:.4,state:{spread:1,angle:-9,original:0}},{p:.75,state:{spread:1,angle:-9,original:0}},{p:.92,state:{spread:0,angle:0,original:0}},{p:1,state:{spread:0,angle:0,original:1}}]);
let progress=0;
const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),leader=document.createElementNS(ns,'path');svg.classList.add('leader');svg.setAttribute('aria-hidden','true');svg.append(leader);$('.pin').append(svg);
function render(state){
 $('.board').style.transform=`rotateY(${state.angle}deg) rotateX(${state.spread*6}deg)`;
 images.forEach((im,i)=>{const [x,y,z]=offsets[i];im.style.transform=`translate3d(${x*state.spread}px,${y*state.spread}px,${z*state.spread}px)`;});
 $('.original').style.opacity=state.original;
 const index=progress<.3?0:progress<.5?4:progress<.7?3:5;
 const marker=images[index]?.querySelector('.anchor');
 if(marker){const a=marker.getBoundingClientRect(),b=$('#chapter-title').getBoundingClientRect(),r=$('.pin').getBoundingClientRect();const x=a.left-r.left,y=a.top-r.top,tx=b.left-r.left-18,ty=b.top-r.top+b.height/2;leader.setAttribute('d',`M${x},${y} L${tx-24},${y} L${tx},${ty}`);svg.style.opacity=String(state.spread*.6);}

}
const engine=new CaseStudyEngine({load:async()=>({validated:manifest.validated,timeline,chapters,surface:new DisplaySurface({snapshot:()=>({}),restore:()=>render(timeline.stateAt(0)),present:render,dispose(){}}),dispose(){observer?.dispose();}})});
function describe(p){const c=chapters.reduce((a,c)=>p>=c.progress-.06?c:a,chapters[0]);$('#counter').textContent=`0${chapters.indexOf(c)+1} / 06`;$('#chapter-title').textContent=c.title;$('#chapter-copy').textContent=c.copy;$('.source').textContent=['product','recompose'].includes(c.id)?'IMPLEMENTATION NOTE':'DESIGNER INTENT · OWNER NOTES';for(const b of $('#chapters').children)b.setAttribute('aria-current',String(b.dataset.id===c.id));}
function setStatic(value){observer?.dispose();observer=undefined;root.classList.toggle('is-static',value);$('#mode').textContent=value?'Scroll presentation':'Static chapters';if(!value)observer=observeProgress(section,p=>{progress=p;engine.seek(p);describe(p);});}
for(const c of chapters){const b=document.createElement('button');b.textContent=String(chapters.indexOf(c)+1);b.dataset.id=c.id;b.setAttribute('aria-label',c.title);b.onclick=()=>observer?.seek(c.progress);$('#chapters').append(b);}
try{
 manifest=await fetch(new URL('../projects/jbl-artwork/manifest.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Manifest unavailable');return r.json();});
 if(!manifest.validated)throw Error('Layer validation incomplete');
 for(const l of manifest.layers){const im=new Image();im.src=new URL(`../projects/jbl-artwork/${l.src}`,import.meta.url);im.alt='';await im.decode();const plane=document.createElement('div');plane.className='plane';const marker=document.createElement('i');marker.className='anchor';const [x,y,w,h]=[l.bbox[0],l.bbox[1],l.bbox[2]-l.bbox[0],l.bbox[3]-l.bbox[1]];marker.style.left=`${(x+w/2)/2480*100}%`;marker.style.top=`${(y+h/2)/3508*100}%`;plane.append(im,marker);$('#planes').append(plane);images.push(plane);}
 await engine.open('jbl-artwork');root.classList.add('motion-ready');$('#loading').textContent='Scroll to separate the original layers';setStatic(motion.matches);describe(0);
 $('#mode').onclick=()=>setStatic(!root.classList.contains('is-static')||motion.matches);
 $('#replay').onclick=()=>observer?.seek(0);
 motion.addEventListener('change',()=>setStatic(motion.matches));
 addEventListener('keydown',e=>{if(e.key==='Escape')$('#exit').click();});
 addEventListener('pagehide',()=>engine.close(),{once:true});
}catch(error){$('#loading').textContent='Presentation unavailable. Read the chapters below.';root.classList.add('is-static');$('#mode').hidden=true;}

if(new URLSearchParams(location.search).get('embedded')==='1'&&parent!==window){$('#exit').onclick=e=>{e.preventDefault();parent.postMessage({type:'case-study:close'},location.origin);};}
