import {loadWebGLLayers} from '../case-studies/shared/webgl-layers.mjs';
import {registerShowroomBridge} from '../case-studies/shared/showroom-bridge.mjs';
import {createSurfaceTransition} from '../case-studies/shared/surface-transition.mjs';

/**
 * Real projects and actual artwork paths inspected from:
 * https://github.com/GiorgiGiorgadze18/PortfolioWebsite/blob/main/projects.html
 * No fabricated project screens. Device models are original procedural geometry.
 *
 * Artwork uses repository-local assets; the supplied v0.14 source is preserved in
 * portfolio-3d-showroom-test-v14.zip. See docs/SHOWROOM.md for integration details.
 */

import {PROJECTS, ARCHIVE_PROJECTS} from '../data/projects.mjs?v=0.17.5';
let gridView = document.documentElement.dataset.projectLayout === 'grid';
let graphicsUnavailable = false;
let initialization;
const projectSide = project => project.category==='graphics'?'graphics':'apps';
let shelfAssembly, shelfSides;
let gallerySide='apps', shelfTurn=null, queuedSide=null;
const LOCAL_BASE = ['http:','https:','file:'].includes(location.protocol) ? new URL('./assets/',location.href).href : './assets/';

const assetUrl=(filename)=>filename.startsWith('data:')?filename:window.SHOWROOM_EMBEDDED_ASSETS?.[filename]||`${window.SHOWROOM_ASSET_BASE||LOCAL_BASE}${encodeURIComponent(filename)}`;
const assetFallbacks = (filename) => [assetUrl(filename)];


const $=s=>document.querySelector(s);
const sceneHost=$('#showroom-canvas'), frame=$('#museum-frame'), labelsEl=$('#device-labels');
const stageLoading=$('#stage-enter');
const projectGrid=$('#project-grid'), inspector=$('#project-inspector');
const closeButton=$('#inspector-close'), resetButton=$('#reset-view');
const halo=$('#ambient-halo'),shelfSwitch=$('#shelf-switch'),outline=$('#tablet-outline');
const outlinePaths=outline.querySelectorAll('path');
let outlinePending=false,outlineRunning=false;
const focusHost=$('#focus-canvas');
let caseSurface=null,caseLayers=null;
let THREE, renderer, focusRenderer, scene, camera, raycaster, pointer, ambientLight, lightKey, lightAccent, glowSprite;
let accentTarget, accentCurrent, movingTween, selected=null, hovered=null, cameraTarget, portalPlane;
let sceneReady=false, state='gallery', queuedSelection=null, lastFrame=0, initialTime=0, lastPointer={x:0,y:0};
let selectedBaseQuaternion=null, dragOrbit=false, shadowTexture=null;
const focusTilt={x:0,y:0}, focusTiltTarget={x:0,y:0};
const meshes=[], displayItems=new Map(), accentReactiveMaterials=[], exhibitSpots=new Map();
const ACTIVE_LAYER=1; let activeLayerOn=false, pointerDownPos=null;
const startLook={x:0,y:.55,z:10.45};
const reduceMotionMedia=matchMedia('(prefers-reduced-motion: reduce)');
const motionReduced=()=>reduceMotionMedia.matches;
let pointerInGallery=false, keyboardHovered=null, pointerHovered=null;
let environmentZoom=1,environmentZoomTarget=1,previewActive=false;
reduceMotionMedia.addEventListener('change',()=>{
 if(!motionReduced())return;
 pointerInGallery=false;focusTilt.x=focusTilt.y=focusTiltTarget.x=focusTiltTarget.y=0;
 displayItems.forEach(d=>{d.magnet.x=d.magnet.y=0;});
 if(movingTween)tickTween(movingTween.start+movingTween.duration);
});
const mobilePreviewMedia = matchMedia('(max-width:600px), (pointer:coarse)');
const compactMedia=matchMedia('(max-width:600px)');
const compactView=()=>compactMedia.matches;
const staticPreview = () => previewActive && mobilePreviewMedia.matches;
let stageVisible=true,lastRendered=0,resizePending=false;
let backdropZoom=NaN,backdropSettlesAt=0;
const GALLERY_PIXEL_RATIO=1.4;
const FOCUS_PIXEL_RATIO=1.65;

function setAccent(hex){frame.style.setProperty('--active-light',hex);halo.style.background=`radial-gradient(ellipse 46% 54% at 48% 48%, ${hex}19, transparent 70%)`;if(THREE&&accentTarget) accentTarget.set(hex);}
function buildArchive(){
 const filters = document.querySelector('.filter-group');
 for (const summary of projectGrid.querySelectorAll('[data-explore]')) {
  const project = ARCHIVE_PROJECTS.find(entry => entry.id === summary.dataset.explore);
  summary.addEventListener('click', event => {
   event.preventDefault();
   history.pushState(null, '', '#project/' + project.slug);
   openAccessibleDetail(project);
  });
 }
 for (const button of filters.querySelectorAll('[data-filter]')) {
  button.disabled = false;
  button.addEventListener('click', () => {
   for (const peer of filters.querySelectorAll('[data-filter]')) {
    peer.classList.toggle('is-active', peer === button);
    peer.setAttribute('aria-pressed', String(peer === button));
   }
   for (const card of projectGrid.children) {
    card.hidden = button.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(button.dataset.filter);
   }
  });
 }
}
let modal;
function openAccessibleDetail(p){if(!modal){modal=document.createElement('dialog');modal.className='mobile-project-dialog';modal.innerHTML='<div class="mobile-project-inner"><button class="mobile-dialog-close" type="button" aria-label="Close">×</button><p class="mobile-dialog-kicker"></p><h2></h2><div class="mobile-dialog-art"><img alt=""></div><p class="mobile-dialog-description"></p><a class="mobile-dialog-link" target="_blank" rel="noopener noreferrer">VIEW ORIGINAL ARTWORK ↗</a></div>';document.body.append(modal);modal.querySelector('button').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});const s=document.createElement('style');s.textContent='.mobile-project-dialog{border:1px solid rgba(208,188,255,.32);border-radius:13px;box-shadow:0 30px 100px rgba(0,0,0,.8);background:#0A0E1A;color:white;max-width:min(660px,calc(100vw - 32px));max-height:90vh;padding:0}.mobile-project-dialog::backdrop{background:rgba(3,5,12,.86);backdrop-filter:blur(10px)}.mobile-project-inner{padding:25px;position:relative}.mobile-dialog-close{position:absolute;right:13px;top:11px;font-size:26px;border:0;background:transparent;color:white}.mobile-dialog-kicker{font-size:10px;color:var(--active-tint);letter-spacing:.18em}.mobile-project-inner h2{font:800 26px Inter,sans-serif;margin:8px 0 20px;line-height:1.2}.mobile-dialog-art{display:flex;justify-content:center;background:#050711;max-height:42vh}.mobile-dialog-art img{max-height:42vh;max-width:100%;object-fit:contain}.mobile-dialog-description{color:rgba(255,255,255,.7);font:400 13px/1.7 Inter,sans-serif}.mobile-dialog-link{display:inline-block;margin-top:9px;padding:11px 16px;border:1px solid var(--active-light);color:var(--active-tint);border-radius:30px;font:700 10px Space Grotesk,sans-serif}';document.head.append(s)}modal.style.setProperty('--active-light',p.accent);modal.querySelector('.mobile-dialog-kicker').textContent=p.categoryLabel.toUpperCase()+' · '+p.year;modal.querySelector('h2').textContent=p.name;const img=modal.querySelector('img');img.src=assetUrl(p.cover);img.alt=p.name+' artwork';modal.querySelector('.mobile-dialog-description').textContent=p.description;modal.querySelector('.mobile-dialog-link').href=p.id==='portfolio'?'index.html':assetUrl(p.cover);modal.querySelector('.mobile-dialog-link').textContent=p.id==='portfolio'?'OPEN PORTFOLIO ↗':'VIEW ORIGINAL ARTWORK ↗';let demoButton=modal.querySelector('[data-open-demo]');
if(!demoButton){demoButton=document.createElement('button');demoButton.type='button';demoButton.className='mobile-dialog-link';demoButton.dataset.openDemo='';modal.querySelector('.mobile-project-inner').append(demoButton)}
demoButton.hidden=!p.demo || graphicsUnavailable;
demoButton.textContent='OPEN IN 3D SHOWROOM';
demoButton.onclick=async()=>{modal.close();setProjectView(false);await initialization;if(!gridView)chooseProject(p.id)};
if(!modal.open)modal.showModal();}

function roundedShape(w,h,r){const s=new THREE.Shape();const l=-w/2,b=-h/2; r=Math.min(r,w/2,h/2);s.moveTo(l+r,b);s.lineTo(l+w-r,b);s.quadraticCurveTo(l+w,b,l+w,b+r);s.lineTo(l+w,b+h-r);s.quadraticCurveTo(l+w,b+h,l+w-r,b+h);s.lineTo(l+r,b+h);s.quadraticCurveTo(l,b+h,l,b+h-r);s.lineTo(l,b+r);s.quadraticCurveTo(l,b,l+r,b);return s;}
function clamp(v,min,max){return Math.min(max,Math.max(min,v))}
function damp(current,target,rise,fall){const k=target>current?rise:fall;return current+(target-current)*k;}
function surfaceMaterial(options){
 if(!mobilePreviewMedia.matches)return new THREE.MeshPhysicalMaterial(options);
 const {clearcoat,clearcoatRoughness,reflectivity,ior,...basic}=options;
 return new THREE.MeshStandardMaterial(basic);
}
function material(color,metalness=.45,roughness=.36){const m=surfaceMaterial({color,metalness,roughness,clearcoat:.35,clearcoatRoughness:.22});m.dithering=true;return m}
const metal=()=>material('#343B4B',.78,.26), dark=()=>material('#141824',.48,.34),standMat=()=>material('#82725F',.77,.29);
function roundedPlate(w,h,d,r,mat){const g=new THREE.ExtrudeGeometry(roundedShape(w,h,r),{depth:d,bevelEnabled:true,bevelThickness:.015,bevelSize:.018,bevelSegments:8,steps:1,curveSegments:26});const o=new THREE.Mesh(g,mat);o.position.z=-d/2;o.castShadow=true;o.receiveShadow=true;return o;}
function screenRadius(w,h,p){return p.device==='phone'?.13:Math.min(w,h)*.055;}
function screenSurface(w,h,p,depth=.103){
 const shape=roundedShape(w,h,screenRadius(w,h,p));
 // MeshBasicMaterial is independent of spotlights/tone-mapping: posters stay genuinely screen-bright.
 const mat=new THREE.MeshBasicMaterial({color:'#ffffff',side:THREE.FrontSide,toneMapped:false,fog:false});
 const geometry=new THREE.ShapeGeometry(shape,32);
 // ShapeGeometry uses world-space XY as UVs. Normalize before applying an image.
 const positions=geometry.attributes.position,uv=geometry.attributes.uv;
 for(let i=0;i<uv.count;i++)uv.setXY(i,positions.getX(i)/w+.5,positions.getY(i)/h+.5);
 uv.needsUpdate=true;
 const mesh=new THREE.Mesh(geometry,mat);
 mesh.position.z=depth;mesh.userData.projectId=p.id;mesh.userData.isScreen=true;
 mesh.renderOrder=4;meshes.push(mesh);return mesh;
}
function useOriginalArtwork(mesh,p,w,h){
 const cn=document.createElement('canvas'),size=512;
 cn.width=w>h?size:Math.round(size*w/h);cn.height=h>=w?size:Math.round(size*h/w);
 const ctx=cn.getContext('2d',{alpha:true}),cw=cn.width,ch=cn.height;
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 const renderPlaceholder=(message)=>{
  ctx.clearRect(0,0,cw,ch);
  const gradient=ctx.createLinearGradient(0,0,cw,ch);
  gradient.addColorStop(0,'#20283D');gradient.addColorStop(.58,p.accent);gradient.addColorStop(1,'#080D1A');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,cw,ch);
  ctx.fillStyle='rgba(6,10,20,.40)';ctx.fillRect(0,0,cw,ch);
  ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(cw*.06,ch*.07,cw*.88,ch*.86);
  ctx.textAlign='center';ctx.fillStyle='#F1EAFF';ctx.font=`700 ${Math.max(16,Math.floor(cw/24))}px Inter, sans-serif`;
  ctx.fillText(p.shortName,cw/2,ch/2-10);
  ctx.fillStyle='rgba(241,234,255,.7)';ctx.font=`500 ${Math.max(12,Math.floor(cw/47))}px sans-serif`;
  ctx.fillText(message,cw/2,ch/2+22);
 };
 renderPlaceholder('LOADING ORIGINAL ARTWORK');
 function createTexture(image){
  const texture=new THREE.CanvasTexture(image);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());
  return texture;
 }
 mesh.material.map=createTexture(cn);
 mesh.material.needsUpdate=true;
 const candidates=assetFallbacks(p.screenArtwork ?? p.cover);
 const loadCandidate=(idx=0)=>{
  if(idx>=candidates.length){renderPlaceholder('ORIGINAL IMAGE UNAVAILABLE');mesh.material.map.needsUpdate=true;return;}
  const image=new Image();image.decoding='async';image.crossOrigin='anonymous';
  image.onload=()=>{
   // Keep the screen's native proportions and cap resident texture memory.
   const limit=Math.min(2048,renderer.capabilities.maxTextureSize);
   const density=Math.min(image.width/w,image.height/h,limit/Math.max(w,h));
   const artwork=document.createElement('canvas');
   artwork.width=Math.max(1,Math.round(w*density));
   artwork.height=Math.max(1,Math.round(h*density));
   const paint=artwork.getContext('2d');
   paint.imageSmoothingQuality='high';
   const cover=Math.max(artwork.width/image.width,artwork.height/image.height);
   const dw=image.width*cover,dh=image.height*cover;
   paint.drawImage(image,(artwork.width-dw)/2,(artwork.height-dh)/2,dw,dh);
   // The placeholder already owns immutable GPU storage at a different size.
   const placeholder=mesh.material.map;
   mesh.material.map=createTexture(artwork);
   placeholder.dispose();
   staticFramePainted=false;
   backdropZoom=NaN;
  };
  image.onerror=()=>loadCandidate(idx+1);
  image.src=candidates[idx];
 };
 loadCandidate(0);
}


function addProjectHit(group,p){group.traverse(o=>{if(o.isMesh){o.userData.projectId=p.id;meshes.push(o)}})}
function deviceFactory(p){const group=new THREE.Group();const colorMat=metal();let w,h,d;
 switch(p.device){case'phone':w=1.12;h=2.24;d=.11;break;case'tablet':w=2.3;h=1.5175;d=.09;break;case'monitor':w=2.68;h=1.64;d=.13;break;default:h=2.25;w=(h-.18)*p.artAspect+.16;d=.095;}
 const bodyRadius=p.device==='phone'?.19:.12;
 const body=roundedPlate(w,h,d,bodyRadius,colorMat);group.add(body);
 const bezel=roundedPlate(w-.09,h-.09,.028,p.device==='phone'?.14:.09,surfaceMaterial({color:'#111520',metalness:.18,roughness:.88,clearcoat:.05}));bezel.position.z=.045;group.add(bezel);
 const sh=h-(p.device==='phone'?.22:.18);
 const sw=p.demo?sh*p.demo.width/p.demo.height:w-(p.device==='phone'?.15:.16);
 const recess=new THREE.Mesh(new THREE.ShapeGeometry(roundedShape(sw+.07,sh+.07,screenRadius(sw,sh,p)+.035),32),new THREE.MeshBasicMaterial({color:'#06080E'}));recess.position.z=.081;group.add(recess);
 const surface=screenSurface(sw,sh,p,.104);group.add(surface);useOriginalArtwork(surface,p,sw,sh);
 const glassMat=surfaceMaterial({color:'#ffffff',metalness:0,roughness:.03,transparent:true,opacity:.02,clearcoat:1,clearcoatRoughness:.05,reflectivity:.38,ior:1.46,depthWrite:false});glassMat.dithering=true;
 const glass=new THREE.Mesh(new THREE.ShapeGeometry(roundedShape(sw,sh,screenRadius(sw,sh,p)),32),glassMat);glass.position.z=.114;group.add(glass);
 const screenLight=new THREE.PointLight('#ffffff',0.16,p.device==='monitor'?4.4:(p.device==='tablet'?3.5:3),2);screenLight.position.set(0,0,.72);screenLight.visible=!mobilePreviewMedia.matches;group.add(screenLight);
 if(p.device==='phone'){
  const earpiece=new THREE.Mesh(new THREE.CapsuleGeometry(.038,.065,4,10),new THREE.MeshBasicMaterial({color:'#0A0D14'}));earpiece.rotation.z=Math.PI/2;earpiece.position.set(0,h/2-.092,.111);group.add(earpiece);
  const cameraRing=new THREE.Mesh(new THREE.CircleGeometry(.022,28),new THREE.MeshBasicMaterial({color:'#020305'}));cameraRing.position.set(.115,h/2-.093,.112);group.add(cameraRing);
  const cameraGlass=new THREE.Mesh(new THREE.CircleGeometry(.0115,24),new THREE.MeshBasicMaterial({color:'#111A2A'}));cameraGlass.position.set(.115,h/2-.093,.113);group.add(cameraGlass);
  const cameraSpec=new THREE.Mesh(new THREE.CircleGeometry(.0036,16),new THREE.MeshBasicMaterial({color:'#8BCBFF',transparent:true,opacity:.42}));cameraSpec.position.set(.121,h/2-.087,.114);group.add(cameraSpec);
  const support=new THREE.Mesh(new THREE.BoxGeometry(.64,.095,.55),surfaceMaterial({map:grainTexture('walnut'),color:'#A78F7C',metalness:.05,roughness:.58,clearcoat:.12}));support.position.set(0,-h/2-.04,-.19);support.rotation.x=.15;support.castShadow=true;group.add(support);
 }
 if(p.device==='monitor'){
  const st=new THREE.Mesh(new THREE.BoxGeometry(.13,.8,.17),surfaceMaterial({map:grainTexture('walnut'),color:'#A78F7C',metalness:.08,roughness:.56,clearcoat:.1}));st.position.set(0,-h/2-.33,-.045);group.add(st);
  const stemAccent=new THREE.Mesh(new THREE.BoxGeometry(.045,.78,.02),material('#A48968',.82,.26));stemAccent.position.set(0,-h/2-.33,.05);group.add(stemAccent);
  const base=new THREE.Mesh(new THREE.BoxGeometry(1.18,.075,.65),material('#5A5661',.55,.38));base.position.set(0,-h/2-.73,.02);base.castShadow=true;group.add(base);
  const back=new THREE.Mesh(new THREE.BoxGeometry(w*.7,h*.67,.07),surfaceMaterial({map:grainTexture('linen'),color:'#C9CBD7',metalness:.07,roughness:.84}));back.position.z=-.14;group.add(back);
 }
 if(p.device==='tablet'){
  const stand=new THREE.Mesh(new THREE.BoxGeometry(1.4,.09,.4),surfaceMaterial({map:grainTexture('walnut'),color:'#A78F7C',metalness:.06,roughness:.55,clearcoat:.12}));stand.position.set(0,-h/2-.1,-.16);stand.rotation.x=.15;stand.castShadow=true;group.add(stand);
 }
 if(p.device==='poster'){
  const foot=new THREE.Mesh(new THREE.BoxGeometry(.88,.07,.5),surfaceMaterial({map:grainTexture('walnut'),color:'#A78F7C',metalness:.05,roughness:.58,clearcoat:.12}));foot.position.set(0,-h/2-.09,-.1);foot.castShadow=true;foot.userData.caseStudySupport=true;group.add(foot);
  const spine=new THREE.Mesh(new THREE.BoxGeometry(.06,1.2,.09),material('#8F7B63',.78,.33));spine.position.set(0,-.65,-.08);spine.userData.caseStudySupport=true;group.add(spine);
 }
 group.position.set(...p.scene.position);group.rotation.set(...p.scene.rotation);group.scale.setScalar(p.scene.scale);addProjectHit(group,p);
 group.traverse(obj=>{if(obj.isMesh&&obj.material?.color){obj.material.userData.baseColor=obj.material.color.clone();}});
 return {hoverAmount:0,dimAmount:0,lightAmount:0,magnet:{x:0,y:0},project:p,group,screen:surface,screenLight,homePosition:group.position.clone(),homeQuaternion:group.quaternion.clone(),homeScale:p.scene.scale,screenDimensions:{w:sw,h:sh},bodyDimensions:{w,h,radius:bodyRadius}};
}
function makeGlowTexture(){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),grad=ctx.createRadialGradient(64,64,2,64,64,62);grad.addColorStop(0,'rgba(255,255,255,.58)');grad.addColorStop(.15,'rgba(255,255,255,.32)');grad.addColorStop(.45,'rgba(255,255,255,.11)');grad.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}
// Camera-facing *world-anchored* haze. The emitter never billboards away from its lamp.
function makeSoftBeam(origin,end){
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(12),3));
 geometry.setAttribute('uv',new THREE.BufferAttribute(new Float32Array([0,0,1,0,0,1,1,1]),2));
 geometry.setIndex([0,2,1,2,3,1]);
 const material=new THREE.ShaderMaterial({
  uniforms:{uOpacity:{value:0},uColor:{value:new THREE.Color('#F2E7FF')}},
  vertexShader:`varying vec2 vUv;
   void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`varying vec2 vUv;uniform float uOpacity;uniform vec3 uColor;
   void main(){
    // Taper density analytically on a rectangular quad. Trapezoid UV interpolation
    // would pull the bright centre toward its triangle diagonal.
    float spread=mix(0.13,1.0,vUv.y);
    float x=abs(vUv.x*2.0-1.0)/spread;
    float feather=exp(-x*x*5.4)*(1.0-smoothstep(0.45,1.0,x));
    float falloff=(0.82-0.64*vUv.y)*(1.0-smoothstep(0.88,1.0,vUv.y));
    gl_FragColor=vec4(uColor,uOpacity*feather*falloff);
   }`,
  transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false
 });
 const mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;
 mesh.userData.origin=origin.clone();mesh.userData.end=end.clone();scene.add(mesh);return mesh;
}
const beamSideScratch={};
function alignSoftBeam(beam){
 const {origin,end}=beam.userData;
 const axis=beamSideScratch.axis??=new THREE.Vector3(),view=beamSideScratch.view??=new THREE.Vector3();
 const side=beamSideScratch.side??=new THREE.Vector3(),point=beamSideScratch.point??=new THREE.Vector3();
 axis.subVectors(end,origin).normalize();view.subVectors(beam.parent.worldToLocal(view.copy(camera.position)),origin).normalize();
 side.crossVectors(axis,view).normalize();if(side.lengthSq()<.01)side.set(1,0,0);
 const position=beam.geometry.attributes.position;
 for(let i=0;i<4;i++){
  const bottom=i>=2,sign=i%2?1:-1;
  point.copy(bottom?end:origin).addScaledVector(side,sign*1.95);
  position.setXYZ(i,point.x,point.y,point.z);
 }
 position.needsUpdate=true;
}
function makeLightParticles(origin,height,index){
 const count=32,geometry=new THREE.BufferGeometry();
 const positions=new Float32Array(count*3),phases=new Float32Array(count),angles=new Float32Array(count),radii=new Float32Array(count);
 let seed=173+index*761;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<count;i++){phases[i]=rand();angles[i]=rand()*Math.PI*2;radii[i]=Math.sqrt(rand());}
 geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
 for(const [name,values] of [['aPhase',phases],['aAngle',angles],['aRadius',radii]])geometry.setAttribute(name,new THREE.BufferAttribute(values,1));
 const material=new THREE.ShaderMaterial({
  uniforms:{uTime:{value:0},uOpacity:{value:0},uOrigin:{value:origin.clone()},uHeight:{value:height},uPixelRatio:{value:1}},
  vertexShader:`attribute float aPhase;attribute float aAngle;attribute float aRadius;
   uniform float uTime;uniform vec3 uOrigin;uniform float uHeight;uniform float uPixelRatio;
   varying float vFade;
   void main(){
    float t=fract(aPhase+uTime*0.014);
    float angle=aAngle+uTime*0.035;
    float radius=(0.025+t*0.64)*aRadius;
    vec3 point=uOrigin+vec3(cos(angle)*radius,-t*uHeight,sin(angle)*radius);
    vec4 mv=modelViewMatrix*vec4(point,1.0);
    gl_Position=projectionMatrix*mv;
    gl_PointSize=clamp(26.0/-mv.z,1.2,3.0)*uPixelRatio;
    vFade=smoothstep(0.02,0.14,t)*(1.0-smoothstep(0.80,0.98,t));
   }`,
  fragmentShader:`uniform float uOpacity;varying float vFade;
   void main(){float r=length(gl_PointCoord-0.5)*2.0;
    float a=exp(-r*r*4.8)*(1.0-smoothstep(0.45,1.0,r));
    gl_FragColor=vec4(0.88,0.91,1.0,a*vFade*uOpacity);
   }`,
  transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false
 });
 const points=new THREE.Points(geometry,material);points.frustumCulled=false;scene.add(points);return points;
}
function makeShadowTexture(){
 if(shadowTexture)return shadowTexture;
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');
 const grad=ctx.createRadialGradient(128,128,12,128,128,126);grad.addColorStop(0,'rgba(0,0,0,.69)');grad.addColorStop(.58,'rgba(0,0,0,.32)');grad.addColorStop(1,'rgba(0,0,0,0)');
 ctx.fillStyle=grad;ctx.fillRect(0,0,256,256);shadowTexture=new THREE.CanvasTexture(c);return shadowTexture;
}
function addShelfContact(project,side){
 const footprints={phone:[.72,.62],tablet:[1.6,.56],poster:[1,.59]};
 const [width,depth]=footprints[project.device];
 const contact=new THREE.Mesh(new THREE.PlaneGeometry(width*project.scene.scale,depth*project.scene.scale),
  new THREE.MeshBasicMaterial({map:makeShadowTexture(),transparent:true,depthWrite:false,toneMapped:false,polygonOffset:true,polygonOffsetFactor:-1}));
 contact.rotation.x=-Math.PI/2;
 contact.position.set(project.scene.position[0],-1.398,project.scene.position[2]+.08);
 side.add(contact);
 return contact;
}
const DECK_Y=-1.4, FLOOR_Y=-1.96, LAMP_Z=.89;

function addCastShadow(device,side){
 const {w,h,radius}=device.bodyDimensions;
 const outline=roundedShape(w,h,radius).getPoints(4);
 if(outline[0].equals(outline.at(-1)))outline.pop();
 const count=outline.length;
 const geometry=new THREE.BufferGeometry();
 const positions=new THREE.Float32BufferAttribute(new Float32Array((1+count*2)*3),3);
 positions.setUsage(THREE.DynamicDrawUsage);
 geometry.setAttribute('position',positions);
 const opacity=new Array(count+1).fill(1).concat(new Array(count).fill(0));
 geometry.setAttribute('aEdge',new THREE.Float32BufferAttribute(opacity,1));
 const indices=[];
 for(let i=0;i<count;i++){
  const a=1+i,b=1+(i+1)%count;
  indices.push(0,a,b,a,a+count,b,b,a+count,b+count);
 }
 geometry.setIndex(indices);
 const mesh=new THREE.Mesh(geometry,new THREE.ShaderMaterial({
  uniforms:{bounds:{value:new THREE.Vector4()},strength:{value:0}},
  vertexShader:`attribute float aEdge; varying float vEdge; varying vec2 vGround;
   void main(){vEdge=aEdge;vGround=position.xz;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`uniform vec4 bounds;uniform float strength; varying float vEdge; varying vec2 vGround;
   void main(){vec2 edge=min(vGround-bounds.xy,bounds.zw-vGround);
    float feather=smoothstep(0.0,0.035,min(edge.x,edge.y));
    gl_FragColor=vec4(0.0,0.0,0.0,feather*vEdge*strength);}`,
  side:THREE.DoubleSide,transparent:true,depthWrite:false,toneMapped:false
 }));
 mesh.frustumCulled=false;
 side.add(mesh);
 return {mesh,outline,positions,side,lastPose:new THREE.Matrix4(),onFloor:null,
  points:outline.map(()=>new THREE.Vector3()),lamp:new THREE.Vector3(),center:new THREE.Vector3()};
}

function updateCastShadow(device,rig,onFloor){
 const {mesh,outline,positions,side,lastPose,points,lamp,center}=device.cast;
 device.group.updateMatrix();
 if(device.cast.onFloor===onFloor&&lastPose.equals(device.group.matrix))return;
 lastPose.copy(device.group.matrix);
 device.cast.onFloor=onFloor;
 const receiver=onFloor?scene:side;
 if(mesh.parent!==receiver)receiver.add(mesh);
 const y=onFloor?FLOOR_Y:DECK_Y;
 mesh.material.uniforms.bounds.value.set(...(onFloor?[-9.5,-8,9.5,8]:[-4.4,.11,4.4,1.83]));
 mesh.material.uniforms.strength.value=onFloor?.65:.68;

 lamp.copy(rig.spot.position);
 if(onFloor){
  // Place the overhead source slightly forward so the floor projection stays in view.
  lamp.set(device.group.position.x-.52,3.7,device.group.position.z+.62);
  lightAccent.position.copy(lamp);
 }
 center.set(0,0,0);
 for(let i=0;i<outline.length;i++){
  const point=points[i].set(outline[i].x,outline[i].y,.04).applyMatrix4(device.group.matrix);
  point.lerp(lamp,(point.y-y)/Math.min(-.15,point.y-lamp.y));
  center.add(point);
 }
 center.divideScalar(outline.length);
 positions.setXYZ(0,center.x,y+.003,center.z);
 for(let i=0;i<points.length;i++){
  const point=points[i];
  const dx=point.x-center.x,dz=point.z-center.z;
  const feather=.09/Math.max(.02,Math.hypot(dx,dz));
  positions.setXYZ(i+1,point.x,y+.003,point.z);
  positions.setXYZ(i+1+points.length,point.x+dx*feather,y+.003,point.z+dz*feather);
 }
 positions.needsUpdate=true;
}

function grainTexture(kind){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
 const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(512,256);
 let seed=kind==='walnut'?19702:76283;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let y=0;y<256;y++)for(let x=0;x<512;x++){
  const off=(y*512+x)*4,noise=(rand()-.5)*(kind==='walnut'?12:10);
  const wave=kind==='walnut'?Math.sin(y*.045+Math.sin(x*.008)*1.2)*3.1+Math.sin(y*.012)*1.7:0;
  const base=kind==='walnut'?[82,65,58]:[47,47,66];
  pixels.data[off]=Math.max(0,base[0]+noise+wave);
  pixels.data[off+1]=Math.max(0,base[1]+noise*.7+wave*.62);
  pixels.data[off+2]=Math.max(0,base[2]+noise*.52+wave*.43);
  pixels.data[off+3]=255;
 }
 ctx.putImageData(pixels,0,0);
 if(kind==='walnut'){
  ctx.lineWidth=.8;
  for(let i=0;i<16;i++){
   const y=rand()*256;ctx.strokeStyle=`rgba(192,154,126,${.018+rand()*.035})`;
   ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(190,y-2,300,y+4,512,y+(rand()-.5)*9);ctx.stroke();
  }
 }
 const map=new THREE.CanvasTexture(canvas);
 map.wrapS=map.wrapT=THREE.RepeatWrapping;
 map.repeat.set(kind==='walnut'?2.6:7,kind==='walnut'?1:3);
 map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());map.minFilter=THREE.LinearMipmapLinearFilter;map.magFilter=THREE.LinearFilter;map.generateMipmaps=true;
 return map;
}
function buildReflectionEnvironment(){
 const c=document.createElement('canvas');c.width=1024;c.height=512;
 const ctx=c.getContext('2d');const g=ctx.createLinearGradient(0,0,0,512);
 g.addColorStop(0,'#575A72');g.addColorStop(.35,'#171D2D');g.addColorStop(.7,'#353A51');g.addColorStop(1,'#0C1120');ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height);
 // Broad studio softboxes produce coherent PBR highlights (rather than sharp unity-like lines).
 for(const [x,y,w,h,a] of [[110,62,185,94,.66],[620,75,126,175,.75],[890,105,62,230,.44],[385,315,215,68,.38]]){
  const grd=ctx.createRadialGradient(x+w/2,y+h/2,5,x+w/2,y+h/2,Math.max(w,h)*.85);
  grd.addColorStop(0,`rgba(235,239,255,${a})`);grd.addColorStop(1,'rgba(235,239,255,0)');
  ctx.fillStyle=grd;ctx.fillRect(x-110,y-110,w+220,h+220);
 }
 const t=new THREE.CanvasTexture(c);t.mapping=THREE.EquirectangularReflectionMapping;t.colorSpace=THREE.SRGBColorSpace;
 return t;
}
function buildArchitecture(){
 const wallTexture=grainTexture('linen');
 const wall=surfaceMaterial({map:wallTexture,color:'#A5A6B8',roughness:.82});
 const walnutTexture=grainTexture('walnut');
 const walnut=surfaceMaterial({map:walnutTexture,color:'#BBA390',roughness:.48,metalness:.08,bumpMap:walnutTexture,bumpScale:.025});
 const brass=material('#947B5D',.77,.28);
 const led=new THREE.MeshBasicMaterial({color:'#D0BCFF'});
 accentReactiveMaterials.push(led);

 function box(parent, size, position, material, castsShadow=false){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material);
  mesh.position.set(...position);
  mesh.castShadow=castsShadow;
  mesh.receiveShadow=true;
  parent.add(mesh);
 }

 box(scene,[18,7,.3],[0,.4,-6.5],wall);
 box(scene,[19,.12,16],[0,FLOOR_Y-.06,0],material('#252A37',.48,.43));
 shelfAssembly=new THREE.Group();
 scene.add(shelfAssembly);
 shelfSides={apps:new THREE.Group(),graphics:new THREE.Group()};
 shelfSides.graphics.rotation.y=Math.PI;
 shelfAssembly.add(shelfSides.apps,shelfSides.graphics);

 // One shared cabinet, with decks facing outward on both sides.
 box(shelfAssembly,[8.8,4.6,.24],[0,.48,0],wall,true);
 for(const x of [-4.4,4.4]){
  box(shelfAssembly,[.13,4.7,.58],[x,.46,0],brass,true);
 }
 for(const side of Object.values(shelfSides)){
  box(side,[8.8,.2,1.72],[0,DECK_Y-.10,.97],walnut,true);
  box(side,[8.8,.10,1.35],[0,2.78,.78],walnut,true);
  box(side,[8.8,.035,.04],[0,-1.426,1.84],brass);
  box(side,[8.64,.014,.026],[0,-1.59,1.8],led);
  box(side,[8.6,.014,.027],[0,2.72,1.42],led);
  for(const x of [-3.25,-1.65,0,1.65,3.25]){
   box(side,[.023,3.92,.027],[x,.64,.135],brass);
  }
 }
}

function updateShelfControls(){
 const moving=Boolean(shelfTurn);
 shelfSwitch.dataset.side=shelfTurn?.side??gallerySide;
 shelfSwitch.querySelectorAll('[data-shelf-side]').forEach(button=>{
  button.setAttribute('aria-pressed',String(button.dataset.shelfSide===gallerySide));
  button.setAttribute('aria-disabled',String(moving));
 });
 labelsEl.inert=moving||state!=='gallery';
 labelsEl.classList.toggle('is-hidden',labelsEl.inert);
 for(const label of labelsEl.children){
  const project=PROJECTS.find(p=>p.id===label.dataset.id);
  label.hidden=projectSide(project)!==gallerySide;
 }
}

function showShelfSide(side){
 if(shelfTurn||side===gallerySide)return;
 if(state!=='gallery'){
  queuedSide=side;
  closeProject();
  return;
 }
 hovered=keyboardHovered=pointerHovered=null;
 pointerInGallery=false;
 setAccent('#D0BCFF');
 frame.classList.remove('has-hover');
 shelfTurn={side,from:shelfAssembly.rotation.y,to:side==='graphics'?Math.PI:0,start:performance.now()};
 updateShelfControls();
 if(motionReduced())tickShelfTurn(performance.now());
}

function tickShelfTurn(time){
 if(!shelfTurn)return;
 const turn=shelfTurn;
 const t=motionReduced()?1:clamp((time-turn.start)/950,0,1);
 const smooth=t*t*(3-2*t);
 shelfAssembly.rotation.y=THREE.MathUtils.lerp(turn.from,turn.to,smooth);
 if(t<1)return;
 gallerySide=turn.side;
 shelfTurn=null;
 frame.dataset.shelf=gallerySide;
 $('#stage-caption').textContent=gallerySide==='apps'?'INTERACTIVE APPS':'GRAPHIC DESIGN';
 updateShelfControls();
 if(queuedSelection){
  const id=queuedSelection;
  queuedSelection=null;
  chooseProject(id);
 }
}

function buildShowroomSpots(){
 const softMap=makeGlowTexture();
 for(const [index,p] of PROJECTS.entries()){
  const [x]=p.scene.position;
  const top=2.63,fixtureZ=LAMP_Z;
  const fixture=new THREE.Mesh(new THREE.CylinderGeometry(.205,.235,.19,48),material('#A18C72',.67,.33));
  fixture.position.set(x-.21,top,fixtureZ);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.166,.019,12,48),new THREE.MeshBasicMaterial({color:'#FFF3E8',transparent:true,opacity:0,depthWrite:false}));
  ring.rotation.x=Math.PI/2;ring.position.set(x-.21,top-.11,fixtureZ);
  // Every optical component shares the emitting ring's centre in the rotating shelf.
  const origin=ring.position.clone(),end=new THREE.Vector3(x,-1.38,1.30);
  const beam=makeSoftBeam(origin,end);
  const flare=new THREE.Sprite(new THREE.SpriteMaterial({map:softMap,color:'#FFF7F0',transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
  flare.position.copy(origin);flare.scale.set(.94,.94,1);
  const spot=new THREE.SpotLight('#FFF9EF',0,10.5,.62,.72,1.05);
  spot.position.copy(origin);spot.target.position.copy(end);
  spot.visible=!compactView();
  const particles=makeLightParticles(origin,origin.y-end.y,index);
  const parent=shelfSides[projectSide(p)];
  parent.add(fixture,ring,beam,flare,particles,spot,spot.target);
  exhibitSpots.set(p.id,{spot,ring,beam,flare,particles,amount:0});
 }
 }


function makeScene(){scene=new THREE.Scene();scene.fog=new THREE.FogExp2('#060A14',.016);const rect=sceneHost.getBoundingClientRect();camera=new THREE.PerspectiveCamera(42,Math.max(rect.width,1)/Math.max(rect.height,1),.05,120);camera.position.set(startLook.x,startLook.y,startLook.z);camera.lookAt(0,-.08,0);cameraTarget=new THREE.Vector3(0,-.08,0);renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:mobilePreviewMedia.matches?'low-power':'high-performance',precision:'highp'});renderer.setClearAlpha(0);renderer.setSize(rect.width,rect.height,false);renderer.setPixelRatio(Math.min(devicePixelRatio,GALLERY_PIXEL_RATIO));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;renderer.shadowMap.enabled=!mobilePreviewMedia.matches;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.useLegacyLights=false;sceneHost.appendChild(renderer.domElement);renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();closeProject();showFallback('Graphics context lost');});
 focusRenderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:mobilePreviewMedia.matches?'low-power':'high-performance',precision:'highp'});
 focusRenderer.setClearColor(0x000000,0);focusRenderer.setSize(rect.width,rect.height,false);
 focusRenderer.setPixelRatio(Math.min(devicePixelRatio,FOCUS_PIXEL_RATIO));
 focusRenderer.outputColorSpace=THREE.SRGBColorSpace;focusRenderer.toneMapping=THREE.ACESFilmicToneMapping;focusRenderer.toneMappingExposure=1.08;
 focusRenderer.shadowMap.enabled=!mobilePreviewMedia.matches&&innerWidth>760;focusRenderer.shadowMap.type=THREE.PCFSoftShadowMap;
 focusHost.appendChild(focusRenderer.domElement);
 focusRenderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();closeProject();showFallback('Graphics context lost');});

 ambientLight=new THREE.HemisphereLight('#E6E6F2','#101624',1.18);scene.add(ambientLight);
 lightKey=new THREE.DirectionalLight('#EEF0FF',1.05);
 lightKey.position.set(-4.2,8.2,-2.2);
 lightKey.castShadow=true;
 lightKey.shadow.mapSize.set(1024,1024);
 Object.assign(lightKey.shadow.camera,{left:-6.2,right:6.2,top:6.2,bottom:-6.2});
 lightKey.shadow.bias=-.00028;
 lightKey.shadow.normalBias=.016;
 scene.add(lightKey);
 lightAccent=new THREE.PointLight('#D0BCFF',10,10,2);lightAccent.position.set(-1,1.6,2.8);scene.add(lightAccent);
 const fill=new THREE.PointLight('#00F0FF',1.15,8,2.2);fill.position.set(5,-.3,3);scene.add(fill);
 const warmFill=new THREE.PointLight('#F5CF9D',0.95,7,2.2);warmFill.position.set(-4.6,-.55,2.2);scene.add(warmFill);
 accentTarget=new THREE.Color('#D0BCFF');accentCurrent=accentTarget.clone();scene.environment=buildReflectionEnvironment();scene.environmentIntensity=.18;buildArchitecture();
 glowSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:makeGlowTexture(),color:'#D0BCFF',transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));glowSprite.scale.set(4.6,3.6,1);glowSprite.position.set(0,.4,-1.65);
 PROJECTS.forEach(p=>{const d=deviceFactory(p),side=shelfSides[projectSide(p)];side.add(d.group);d.contact=addShelfContact(p,side);d.cast=addCastShadow(d,side);displayItems.set(p.id,d)});buildShowroomSpots();scene.traverse(o=>{if(o.isLight)o.layers.enable(ACTIVE_LAYER)});
 raycaster=new THREE.Raycaster();pointer=new THREE.Vector2(10,10);sceneReady=true;installCaseStudySurface();initialTime=performance.now();labels();updateShelfControls();
 shelfSwitch.hidden=false;
 for(const button of shelfSwitch.querySelectorAll('[data-shelf-side]')){
  button.addEventListener('click',()=>{
   if(shelfTurn)return;
   queuedSelection=null;
   if(button.dataset.shelfSide===gallerySide){queuedSide=null;return;}
   showShelfSide(button.dataset.shelfSide);
  });
 }
 resizeScene();render(initialTime);
}
function labels(){PROJECTS.forEach((p,i)=>{const b=document.createElement('button');b.className='device-label';b.type='button';b.dataset.id=p.id;b.innerHTML=`<strong>${p.shortName}</strong><small>${p.categoryLabel.toUpperCase()}</small>`;b.style.opacity='0';b.style.left='-300px';b.addEventListener('click',()=>chooseProject(p.id));b.addEventListener('pointerenter',()=>{keyboardHovered=null;setHovered(p.id);});b.addEventListener('pointerleave',()=>setHovered(null));b.addEventListener('focus',()=>setHovered(p.id,'keyboard'));b.addEventListener('blur',()=>setHovered(null,'keyboard'));labelsEl.append(b)})}
function setHovered(id,source='pointer'){
 if(source==='keyboard')keyboardHovered=id;else pointerHovered=id;
 if(state!=='gallery'||shelfTurn)return;
 const next=keyboardHovered||pointerHovered;
 if(hovered===next)return;
 hovered=next;setAccent(PROJECTS.find(p=>p.id===next)?.accent||'#D0BCFF');frame.classList.toggle('has-hover',Boolean(next));
}
function solveHomography(pairs){
 const m=[];
 for(const [[u,v],[x,y]] of pairs){m.push([u,v,1,0,0,0,-u*x,-v*x,x]);m.push([0,0,0,u,v,1,-u*y,-v*y,y]);}
 for(let i=0;i<8;i++){
  let largest=i;for(let j=i+1;j<8;j++)if(Math.abs(m[j][i])>Math.abs(m[largest][i]))largest=j;
  if(Math.abs(m[largest][i])<1e-9)return null;
  [m[i],m[largest]]=[m[largest],m[i]];
  const factor=m[i][i];for(let k=i;k<9;k++)m[i][k]/=factor;
  for(let j=0;j<8;j++){if(j===i)continue;const f=m[j][i];for(let k=i;k<9;k++)m[j][k]-=f*m[i][k];}
 }
 return m.map(r=>r[8]);
}
function renderLabels(now){
 if(state!=='gallery'||shelfTurn)return;
 const compact=compactView();
 const opacity=String(clamp((now-initialTime-550)/450,0,1));
 for(const label of labelsEl.children){
  if(label.hidden)continue;
  setScreenStyle(label,'opacity',opacity);
  if(compact)continue;
  const {group}=displayItems.get(label.dataset.id);
  const point=group.localToWorld(new THREE.Vector3(0,-1.55,0)).project(camera);
  setScreenStyle(label,'left',`${(point.x*.5+.5)*frame.clientWidth}px`);
  setScreenStyle(label,'top',`${Math.min(frame.clientHeight-100,Math.max(105,(-point.y*.5+.5)*frame.clientHeight))}px`);
 }
}
function fitRenderer(renderer,w,h,ratio){
 const size=renderer.getSize(new THREE.Vector2());let changed=false;
 if(renderer.getPixelRatio()!==ratio){renderer.setPixelRatio(ratio);changed=true;}
 if(size.x!==w||size.y!==h){renderer.setSize(w,h,false);changed=true;}
 return changed;
}
function queueSceneResize(){resizePending=true;}
function resizeScene(){
 if(!renderer)return;
 const w=sceneHost.clientWidth,h=sceneHost.clientHeight;if(!w||!h)return;
 camera.aspect=w/h;camera.fov=innerWidth<900?49:42;
 startLook.z=compactView()?Math.max(10.45,4.85/(Math.tan(camera.fov*Math.PI/360)*camera.aspect)+.7):10.45;
 camera.updateProjectionMatrix();if(state==='gallery')camera.position.z=startLook.z;
 backdropZoom=NaN;
 const galleryChanged=fitRenderer(renderer,w,h,Math.min(devicePixelRatio,GALLERY_PIXEL_RATIO));
 const focusChanged=focusRenderer&&fitRenderer(focusRenderer,w,h,Math.min(devicePixelRatio,FOCUS_PIXEL_RATIO));
 renderer.shadowMap.enabled=!mobilePreviewMedia.matches;if(focusRenderer)focusRenderer.shadowMap.enabled=!mobilePreviewMedia.matches&&innerWidth>760;
 if(state==='opening'&&movingTween){
  const {toCam,toQuat,start,duration,done}=movingTween;
  const now=performance.now();
  const layout=focusDestination(selected,toCam,toQuat);
  runTween(selected.id,layout.position,toQuat,layout.scale,toCam,Math.max(0,duration-(now-start)),done);
 }
 // A real buffer resize is drawn in this same frame, even on the phone path.
 if(galleryChanged||focusChanged){
  lastRendered=-Infinity;
  if(previewActive)sendPreviewMode();
 }
}
function focusLayout(project,view,rotation,desiredScale=project.camera.scale){
 const device=displayItems.get(project.id);
 const position=new THREE.Vector3(0,0,project.camera.focusZ);
 const width=frame.clientWidth,height=frame.clientHeight;
 const compact=compactView();
 const availableWidth=compact?width:width-inspector.offsetWidth;
 const availableHeight=Math.max(1,compact?height-inspector.offsetHeight-90:height-160);
 const depth=-view.worldToLocal(position.clone()).z;
 const unitsPerPixel=2*Math.tan(view.fov*Math.PI/360)*depth/(height*view.zoom);
 const scale=Math.min(desiredScale,Math.max(1,availableWidth-(compact?36:24))*unitsPerPixel/device.bodyDimensions.w,availableHeight*unitsPerPixel/device.bodyDimensions.h);
 const offset=device.screen.position.clone().multiplyScalar(scale).applyQuaternion(rotation);
 const projectedDepth=position.clone().add(offset).project(view).z;
 const centerY=compact?24+availableHeight/2:height/2-(project.device==='phone'?48:0);
 position.set(availableWidth/width-1,1-2*centerY/height,projectedDepth).unproject(view).sub(offset);
 return {position,scale};
}

function focusDestination(project,targetPosition,rotation){
 const view=camera.clone();
 view.position.copy(targetPosition);
 view.zoom=1;
 view.lookAt(cameraTarget);
 view.updateProjectionMatrix();
 view.updateMatrixWorld(true);
 return focusLayout(project,view,rotation);
}
function easing(t){return 1-Math.pow(1-t,3)}
function runTween(item,targetPos,targetQuat,targetScale,targetCamera,duration,done){if(movingTween){movingTween=null;}const d=displayItems.get(item),fromCam=camera.position.clone();movingTween={id:item,fromPos:d.group.position.clone(),fromQuat:d.group.quaternion.clone(),fromScale:d.group.scale.x,fromCam,toPos:targetPos.clone(),toQuat:targetQuat.clone(),toScale:targetScale,toCam:targetCamera.clone(),start:performance.now(),duration:motionReduced()?0:duration,done};if(motionReduced())tickTween(performance.now())}
function tickTween(now){if(!movingTween)return;const t=movingTween.duration?Math.min(1,(now-movingTween.start)/movingTween.duration):1,e=easing(Math.max(0,t));const d=displayItems.get(movingTween.id);d.group.position.lerpVectors(movingTween.fromPos,movingTween.toPos,e);d.group.quaternion.copy(movingTween.fromQuat).slerp(movingTween.toQuat,e);d.group.scale.setScalar(movingTween.fromScale+(movingTween.toScale-movingTween.fromScale)*e);camera.position.lerpVectors(movingTween.fromCam,movingTween.toCam,e);camera.lookAt(cameraTarget);if(t>=1){const done=movingTween.done;movingTween=null;done?.();}}
function setForeground(id,enabled){
 const d=displayItems.get(id);if(!d)return;
 d.group.traverse(obj=>{if(obj.isMesh)obj.layers.set(enabled?ACTIVE_LAYER:0)});
 activeLayerOn=enabled;focusHost.classList.toggle('is-active',enabled);
}
function setPanel(p){$('#inspector-index').textContent=`EXHIBIT ${String(PROJECTS.indexOf(p)+1).padStart(2,'0')} / 05`;$('#inspector-kicker').textContent=p.categoryLabel.toUpperCase();$('#inspector-title').textContent=p.name;$('#inspector-year').textContent=p.year;$('#inspector-description').textContent=p.description;$('#inspector-open').href=p.id==='jbl'?'https://github.com/GiorgiGiorgadze18/MeeTab1.1':assetUrl(p.cover);$('#inspector-open').textContent=p.id==='jbl'?'MEETAB PROJECT ↗':'VIEW ORIGINAL ARTWORK ↗';}
function revealShowroom(){
 const rect=frame.getBoundingClientRect();
 const navHeight=$('#navbar')?.offsetHeight||0;
 const toolbarSpace=shelfSwitch.hidden?0:rect.top-shelfSwitch.getBoundingClientRect().top;
 const fitsTogether=rect.height+toolbarSpace<=innerHeight-navHeight;
 const topLimit=navHeight+(fitsTogether?toolbarSpace:0);
 if(rect.top>=topLimit&&rect.bottom<=innerHeight)return;
 const targetTop=Math.max(topLimit,(innerHeight+navHeight-rect.height)/2);
 const root=document.documentElement,previous=root.style.scrollBehavior;
 root.style.scrollBehavior='auto';
 window.scrollBy({top:rect.top-targetTop,behavior:'auto'});
 root.style.scrollBehavior=previous;
}
function openPanel(){backdropSettlesAt=performance.now()+400;frame.classList.add('is-focused');$('#inspector-backdrop').classList.add('is-open');inspector.classList.add('is-open');inspector.setAttribute('aria-hidden','false');inspector.inert=false;resetButton.hidden=false;requestAnimationFrame(()=>{closeButton.focus({preventScroll:true});});updatePreviewButton();sendPreviewMode();}
function closePanel(){clearOutline();environmentZoomTarget=1;previewActive=false;demoBlend=0;syncDemoWorkspace();$('#try-preview').hidden=true;frame.classList.remove('is-focused');$('#inspector-backdrop').classList.remove('is-open');inspector.classList.remove('is-open');inspector.setAttribute('aria-hidden','true');inspector.inert=true;resetButton.hidden=true;sendPreviewMode();}
function chooseProject(id){
 if(caseSurface?.status!==undefined&&caseSurface.status!=='idle')return;
 const project=PROJECTS.find(item=>item.id===id);
 if(!project)return;
 if(!sceneReady){openAccessibleDetail(project);return;}
 if(shelfTurn){queuedSelection=id;return;}
 const side=projectSide(project);
 if(side!==gallerySide){
  queuedSelection=id;
  showShelfSide(side);
  return;
 }
 if(state==='focus'&&selected?.id===id){closeProject();return;}
 if(state!=='gallery'){queuedSelection=id;closeProject();return;}
 environmentZoom=environmentZoomTarget=1;
 camera.zoom=1;
 camera.updateProjectionMatrix();
 revealShowroom();
 hovered=keyboardHovered=pointerHovered=null;
 pointerInGallery=false;
 frame.classList.remove('has-hover');
 selected=project;
 state='opening';
 scene.attach(displayItems.get(id).group);
 setForeground(id,true);
 frame.classList.add('is-focused');
 requestOutlineSweep();
 setPanel(project);
 setAccent(project.accent);
 updateShelfControls();
 $('#stage-caption').textContent=project.shortName+' · DRAG TO ROTATE ±15°';
 lightAccent.position.copy(shelfSides[side].localToWorld(new THREE.Vector3(...project.scene.position))).add(new THREE.Vector3(0,.72,2.95));
 const angles={phone:[-.06,.14,.015],tablet:[-.035,-.045,0],poster:[-.03,-.11,0]};
 const quaternion=new THREE.Quaternion().setFromEuler(new THREE.Euler(...angles[project.device]));
 focusTilt.x=focusTilt.y=0;
 focusTiltTarget.x=focusTiltTarget.y=0;
 const targetPosition=new THREE.Vector3(...project.camera.position);
 const layout=focusDestination(project,targetPosition,quaternion);
 runTween(id,layout.position,quaternion,layout.scale,targetPosition,550,()=>{
  state='focus';
  selectedBaseQuaternion=quaternion.clone();
  openPanel();
  if(project.demo?.bridge)ensureDemoFrame(project);
 });
}

function closeProject(){
 if(caseSurface&&caseSurface.status!=='idle')return;
 if(state==='gallery'||state==='closing'||!selected)return;
 const project=selected;
 const exhibit=displayItems.get(project.id);
 const side=shelfSides[projectSide(project)];
 closePanel();
 state='closing';
 setAccent('#D0BCFF');
 focusTilt.x=focusTilt.y=0;
 focusTiltTarget.x=focusTiltTarget.y=0;
 const homePosition=side.localToWorld(exhibit.homePosition.clone());
 const homeQuaternion=side.getWorldQuaternion(new THREE.Quaternion()).multiply(exhibit.homeQuaternion);
 runTween(project.id,homePosition,homeQuaternion,exhibit.homeScale,new THREE.Vector3(startLook.x,startLook.y,startLook.z),750,()=>{
  side.attach(exhibit.group);
  setForeground(project.id,false);
  state='gallery';
  selected=null;
  selectedBaseQuaternion=null;
  const returnControl=document.querySelector('[data-explore="'+project.id+'"]');
  if(frame.contains(document.activeElement)&&!document.activeElement.closest('#shelf-switch'))returnControl?.focus({preventScroll:true});
  updateShelfControls();
  $('#stage-caption').textContent=gallerySide==='apps'?'INTERACTIVE APPS':'GRAPHIC DESIGN';
  if(queuedSide){
   const nextSide=queuedSide;
   queuedSide=null;
   showShelfSide(nextSide);
   return;
  }
  if(queuedSelection){
   const nextProject=queuedSelection;
   queuedSelection=null;
   chooseProject(nextProject);
  }
 });
}
const demoFrames=new Map();
const currentDemoFrame=()=>demoFrames.get(selected?.id);

function ensureDemoFrame(project){
 if(!project?.demo||mobilePreviewMedia.matches||demoFrames.has(project.id))return;
 const {src,width,height,bridge}=project.demo;
 const iframe=document.createElement('iframe');
 iframe.title=`${project.name} interactive demo`;
 iframe.width=width;
 iframe.height=height;
 iframe.referrerPolicy='no-referrer';
 iframe.hidden=true;
 // MeeTab's opaque frame uses its ready/gesture bridge. The local Tsero export
 // uses same-origin modules and map data, with its own content security policy.
 if(bridge)iframe.setAttribute('sandbox','allow-scripts');
 const session={iframe,ready:false};
 demoFrames.set(project.id,session);
 if(!bridge)iframe.addEventListener('load',()=>markDemoReady(project.id,session),{once:true});
 iframe.src=new URL(src,import.meta.url).href;
 $('#screen-portal').append(iframe);
}

function markDemoReady(projectId,session){
 session.ready=true;
 if(selected?.id!==projectId)return;
 updatePreviewButton();
 if(previewActive&&!mobilePreviewMedia.matches)syncDemoWorkspace();
 sendPreviewMode();
}

function sendPreviewMode(){
 const session=currentDemoFrame();
 if(!selected?.demo?.bridge||!session?.ready)return;
 session.iframe.contentWindow.postMessage({
  showroom:true,
  kind:'interactive',
  enabled:!mobilePreviewMedia.matches&&previewActive&&state==='focus',
 },'*');
}

let demoBlend=0;
let staticFramePainted=false;
function updatePreviewButton(){
 const button=$('#try-preview');
 button.hidden=state!=='focus'||!selected?.demo;
 const waitingForBridge=selected?.demo?.bridge&&!currentDemoFrame()?.ready;
 button.disabled=Boolean(!previewActive&&!mobilePreviewMedia.matches&&waitingForBridge);
 button.textContent=previewActive?'Exit preview':button.disabled?'Loading demo…':'Try now ↗';
}

function syncDemoWorkspace(){
 staticFramePainted=false;
 const mobile=mobilePreviewMedia.matches;
 const session=currentDemoFrame();
 frame.classList.toggle('is-demo',previewActive);
 frame.classList.toggle('is-static-demo',staticPreview());
 const workspace=$('.demo-workspace');
 const restoreFocus=!previewActive&&(workspace.contains(document.activeElement)||document.activeElement===session?.iframe);
 workspace.inert=!previewActive;
 const portal=$('#screen-portal');
 portal.inert=!previewActive||mobile||!session?.ready;
 if(!previewActive)portal.hidden=true;
 updatePreviewButton();
 $('#try-preview').setAttribute('aria-pressed',String(previewActive));
 const hint=$('.interaction-hint');
 hint.innerHTML='<span class="hint-dot"></span>';
 if(previewActive){
  const description=mobile?$('#desktop-demo-notice strong').textContent:
    session?.ready?selected.demo.description:`Loading ${selected.name} demo…`;
  $('#demo-status').textContent=mobile?'PREVIEW ACTIVE':session?.ready?'DEMO ACTIVE':'LOADING DEMO';
  $('#demo-description').textContent=description;
  $('#demo-guide-open').textContent=`Click the screen to use ${selected.name}`;
  $('#demo-guide-scroll').textContent=selected.demo.guide;
  $('.demo-note').textContent=selected.demo.note;
  $('#demo-announcement').textContent=description;
  hint.append(`${mobile?'DESKTOP DEMO':'INTERACTIVE MODE'} · ${selected.shortName}`);
 }else{
  hint.append('SELECT A DEVICE TO EXPLORE');
  $('#demo-announcement').textContent=mobile?'Preview ended.':'Preview ended. Your progress is saved.';
 }
 if(restoreFocus)$('#try-preview').focus({preventScroll:true});
}

function activateInteractiveScreen(project){
 if(!project.demo||state!=='focus')return;
 previewActive=!previewActive;
 if(previewActive){ensureDemoFrame(project);requestOutlineSweep();}
 else clearOutline();
 syncDemoWorkspace();
 sendPreviewMode();
}

mobilePreviewMedia.addEventListener('change',()=>{
 if(previewActive||selected?.demo?.bridge)ensureDemoFrame(selected);
 syncDemoWorkspace();
 sendPreviewMode();
 queueSceneResize();
});
function zoomEnvironment(delta,mode=0){
 if(state!=='focus'||staticPreview()||!Number.isFinite(delta))return;
 const units=delta*(mode===1?16:mode===2?frame.clientHeight:1);
 environmentZoomTarget=clamp(environmentZoomTarget*Math.exp(-clamp(units,-160,160)*.0018),.75,1.65);
}
window.addEventListener('wheel',event=>{
 if(state==='opening' && frame.contains(event.target) && !event.ctrlKey){event.preventDefault();event.stopPropagation();return;}
 if(state!=='focus'||staticPreview()||event.ctrlKey||!frame.contains(event.target)||inspector.contains(event.target))return;
 event.preventDefault();event.stopPropagation();zoomEnvironment(event.deltaY,event.deltaMode);
},{capture:true,passive:false});
window.addEventListener('message',event=>{
 const project=PROJECTS.find(p=>p.demo?.bridge&&demoFrames.get(p.id)?.iframe.contentWindow===event.source);
 if(!project||event.data?.showroom!==true)return;
 const msg=event.data;
 if(msg.kind==='ready'){
  markDemoReady(project.id,demoFrames.get(project.id));
  return;
 }
 if(!previewActive||staticPreview()||state!=='focus'||selected!==project)return;
 if(msg.kind==='wheel'&&Number.isFinite(msg.delta)&&[0,1,2].includes(msg.mode))zoomEnvironment(msg.delta,msg.mode);
 if(msg.kind==='drag'&&Number.isFinite(msg.dx)&&Number.isFinite(msg.dy)){
  focusTiltTarget.y=clamp(focusTiltTarget.y+clamp(msg.dx,-100,100)*.0034,-.26,.26);
  focusTiltTarget.x=clamp(focusTiltTarget.x+clamp(msg.dy,-100,100)*.0029,-.19,.19);
 }
});
const screenStyleCache=new WeakMap();
function setScreenStyle(element,key,value){
 let values=screenStyleCache.get(element);if(!values){values=Object.create(null);screenStyleCache.set(element,values);}
 if(values[key]===value)return;values[key]=value;element.style[key]=value;
}
function positionScreenPortal(){
 const portal=$('#screen-portal');
 const inFocus=state==='focus'&&Boolean(selected?.demo);
 const session=currentDemoFrame();
 const showNotice=inFocus&&staticPreview();
 const showApp=inFocus&&previewActive&&!mobilePreviewMedia.matches&&Boolean(session?.ready);
 const showScreen=showNotice||showApp;
 for(const entry of demoFrames.values())entry.iframe.hidden=!(showApp&&entry===session);

 const vw=frame.clientWidth,vh=frame.clientHeight;
 if(inFocus){
  // Keep the control still while the camera and device interpolate.
  const galleryWidth=vw-inspector.offsetWidth;
  const x=compactView()?vw*.75:galleryWidth/2;
  const y=compactView()?vh-inspector.offsetHeight-56:Math.max(82,vh-110);
  const button=$('#try-preview');
  setScreenStyle(button,'left',x+'px');
  setScreenStyle(button,'top',y+'px');
 }
 const device=selected&&(state==='opening'||state==='focus')?displayItems.get(selected.id):null;
 positionDeviceOutline(device);
 if(!showScreen){
  portal.hidden=true;
  portal.inert=true;
  $('#desktop-demo-notice').hidden=true;
  return;
 }

 const w=device.screenDimensions.w/2,h=device.screenDimensions.h/2;
 const points=[[-w,h],[w,h],[w,-h],[-w,-h]].map(([x,y])=>{
  const v=device.screen.localToWorld(new THREE.Vector3(x,y,0)).project(camera);
  return [(v.x*.5+.5)*vw,(-v.y*.5+.5)*vh];
 });
 let {width,height}=selected.demo;
 let left=0,top=0,transform='none';
 if(showNotice){
  // The camera-facing screen uses its projected size so the notice stays readable.
  width=points[1][0]-points[0][0];
  height=points[3][1]-points[0][1];
  [left,top]=points[0];
 }else{
  const co=solveHomography([[[0,0],points[0]],[[width,0],points[1]],[[width,height],points[2]],[[0,height],points[3]]]);
  if(!co)return;
  const[a,b,c,d,e,f,g,h]=co;
  transform=`matrix3d(${a},${d},0,${g},${b},${e},0,${h},0,0,1,0,${c},${f},0,1)`;
 }
 const r=screenRadius(w*2,h*2,selected);
 setScreenStyle(portal,'borderRadius',`${r/(w*2)*100}% / ${r/(h*2)*100}%`);
 setScreenStyle(portal,'width',width+'px');
 setScreenStyle(portal,'height',height+'px');
 setScreenStyle(portal,'left',left+'px');
 setScreenStyle(portal,'top',top+'px');
 setScreenStyle(portal,'transform',transform);
 $('#desktop-demo-notice').hidden=!showNotice;
 portal.inert=!showApp;
 portal.hidden=false;
}

function clearOutline(){
 outlinePending=outlineRunning=false;
 outline.setAttribute('hidden','');
 outline.classList.remove('is-sweeping');
}

function requestOutlineSweep(){
 clearOutline();
 outlinePending=!motionReduced();
 staticFramePainted=false;
}

outlinePaths[1].addEventListener('animationend',event=>{
 if(event.animationName==='tabletSignal')outlineRunning=false;
});

function positionDeviceOutline(device){
 if(!device)return;
 outline.dataset.project=device.project.id;
 if(motionReduced()){if(outlinePending||outlineRunning)clearOutline();return;}
 if(!outlinePending&&!outlineRunning&&!previewActive)return;
 // Project the body perimeter directly into the SVG's screen coordinates.
 const {w,h,radius}=device.bodyDimensions;
 const x=w/2+.06,y=h/2+.06,r=radius+.045;
 const width=frame.clientWidth,height=frame.clientHeight;
 const point=(u,v)=>{
  const p=device.group.localToWorld(new THREE.Vector3(u,v,.135)).project(camera);
  return `${((p.x+1)*width/2).toFixed(2)} ${((1-p.y)*height/2).toFixed(2)}`;
 };
 const path=`M ${point(-x+r,y)} L ${point(x-r,y)} Q ${point(x,y)} ${point(x,y-r)}
  L ${point(x,-y+r)} Q ${point(x,-y)} ${point(x-r,-y)}
  L ${point(-x+r,-y)} Q ${point(-x,-y)} ${point(-x,-y+r)}
  L ${point(-x,y-r)} Q ${point(-x,y)} ${point(-x+r,y)} Z`;
 for(const stroke of outlinePaths)stroke.setAttribute('d',path);
 if(outlinePending){
  outlinePending=false;
  outlineRunning=true;
  outline.removeAttribute('hidden');
  // Commit the visible path first so a new sweep can replay on the next frame.
  outline.getBoundingClientRect();
  outline.classList.add('is-sweeping');
 }
}

function clientPointer(event){const r=renderer.domElement.getBoundingClientRect();pointer.x=((event.clientX-r.left)/r.width)*2-1;pointer.y=-((event.clientY-r.top)/r.height)*2+1;lastPointer.x=pointer.x;lastPointer.y=pointer.y;}
function identifyUnderPointer(){raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(meshes,false).filter(({object})=>
 projectSide(displayItems.get(object.userData.projectId).project)===gallerySide
 && displayItems.get(object.userData.projectId).group.visible);return hits.length?hits[0].object.userData.projectId:null}
function setupInteraction(){
 $('.demo-exit').addEventListener('click',()=>{if(previewActive&&selected)activateInteractiveScreen(selected);});
 $('#try-preview').addEventListener('click',()=>{if(state==='focus'&&selected)activateInteractiveScreen(selected);});
 const canvas=renderer.domElement,front=focusRenderer.domElement;
 canvas.addEventListener('pointermove',event=>{
  clientPointer(event);pointerInGallery=event.pointerType!=='touch';keyboardHovered=null;
  if(state!=='gallery'||shelfTurn)return;
  const id=identifyUnderPointer();canvas.style.cursor=id?'pointer':'default';setHovered(id);
 });
 canvas.addEventListener('pointerleave',()=>{pointerInGallery=false;lastPointer.x=lastPointer.y=0;setHovered(null);});
 canvas.addEventListener('pointercancel',()=>{pointerInGallery=false;setHovered(null);});
 let galleryPress=null;
 canvas.addEventListener('pointerdown',event=>{if(state!=='gallery'||shelfTurn)return;clientPointer(event);galleryPress={id:identifyUnderPointer(),x:event.clientX,y:event.clientY};});
 canvas.addEventListener('pointerup',event=>{if(state==='gallery'&&!shelfTurn&&galleryPress?.id&&Math.hypot(event.clientX-galleryPress.x,event.clientY-galleryPress.y)<12)chooseProject(galleryPress.id);galleryPress=null;});
 canvas.addEventListener('pointercancel',()=>{galleryPress=null;});
 const touches=new Map();let pinchDistance=0;
 front.addEventListener('pointerdown',event=>{
  if(state!=='focus'||!selected||event.button!==0)return;
  if(event.pointerType==='touch'){touches.set(event.pointerId,{x:event.clientX,y:event.clientY});if(touches.size===2){const [a,b]=[...touches.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);front.setPointerCapture(event.pointerId);event.preventDefault();return;}}
  clientPointer(event);
  // Only actual device pixels begin a drag; blank space dismisses.
  raycaster.layers.set(ACTIVE_LAYER);raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(meshes.filter(m=>m.userData.projectId===selected.id),false).length>0;
  raycaster.layers.set(0);
  if(!hit){closeProject();return;}
  event.stopPropagation();event.preventDefault();dragOrbit=true;
  pointerDownPos={x:event.clientX,y:event.clientY};front.setPointerCapture(event.pointerId);
  front.style.cursor='grabbing';
 });
 front.addEventListener('pointermove',event=>{
  if(state!=='focus'||!selected)return;
  if(staticPreview())return;
  if(touches.has(event.pointerId)){touches.set(event.pointerId,{x:event.clientX,y:event.clientY});if(touches.size===2){const [a,b]=[...touches.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance)environmentZoomTarget=clamp(environmentZoomTarget*distance/pinchDistance,.75,1.65);pinchDistance=distance;event.preventDefault();return;}}
  const r=front.getBoundingClientRect();const px=(event.clientX-r.left)/r.width*2-1,py=1-(event.clientY-r.top)/r.height*2;
  if(dragOrbit&&pointerDownPos){
   const dx=event.clientX-pointerDownPos.x,dy=event.clientY-pointerDownPos.y;
   focusTiltTarget.y=clamp(focusTiltTarget.y+dx*.0034,-.26,.26);
   focusTiltTarget.x=clamp(focusTiltTarget.x+dy*.0029,-.19,.19);
   pointerDownPos={x:event.clientX,y:event.clientY};
  }else{
   focusTiltTarget.y=motionReduced()?0:clamp(px*.10,-.11,.11);focusTiltTarget.x=motionReduced()?0:clamp(-py*.075,-.08,.08);
  }
 });
 const release=event=>{
  touches.delete(event.pointerId);pinchDistance=0;
  dragOrbit=false;pointerDownPos=null;front.style.cursor='grab';
  try{if(front.hasPointerCapture(event.pointerId))front.releasePointerCapture(event.pointerId)}catch{}
 };
 front.addEventListener('pointerup',release);front.addEventListener('pointercancel',release);
 front.addEventListener('pointerleave',()=>{if(!dragOrbit){focusTiltTarget.x=0;focusTiltTarget.y=0}});
}


function installCaseStudySurface(){
 const target=()=>displayItems.get('jbl-artwork').group;
 const capture=()=>({position:target().position.toArray(),rotation:[target().rotation.x,target().rotation.y,target().rotation.z],scale:target().scale.toArray(),camera:camera.position.toArray(),cameraRotation:[camera.rotation.x,camera.rotation.y,camera.rotation.z],zoom:camera.zoom,aspect:camera.aspect,fov:camera.fov,cameraOffsets:camera.view?.enabled?[camera.view.offsetX/camera.view.fullWidth,camera.view.offsetY/camera.view.fullHeight]:[0,0]});
 caseSurface=createSurfaceTransition({capture,reduced:motionReduced,apply(pose){const g=target();g.position.fromArray(pose.position);g.rotation.set(...pose.rotation);g.scale.fromArray(pose.scale);camera.position.fromArray(pose.camera);camera.rotation.set(...pose.cameraRotation);camera.zoom=pose.zoom;if(pose.cameraOffsets.some(v=>v!==0))camera.setViewOffset(innerWidth,innerHeight,pose.cameraOffsets[0]*innerWidth,pose.cameraOffsets[1]*innerHeight,innerWidth,innerHeight);else camera.clearViewOffset();camera.aspect=pose.aspect;camera.fov=pose.fov;camera.updateProjectionMatrix();camera.updateMatrixWorld(true);backdropSettlesAt=performance.now()+100;}});
 registerShowroomBridge({get status(){return caseSurface.status;},inspect:caseSurface.inspect,enter(){if(selected?.id!=='jbl-artwork'||state!=='focus'||movingTween)return Promise.resolve(false);return caseSurface.enter();},async loadLayers(){const stage=await loadWebGLLayers({THREE,device:displayItems.get('jbl-artwork'),camera,layer:ACTIVE_LAYER,baseURL:new URL('../case-studies/projects/jbl-artwork/',import.meta.url)});if(graphicsUnavailable){stage.dispose();throw Error('Showroom unavailable');}caseLayers=stage;},
 setProgress(p,rect){caseLayers?.draw(p,rect);backdropZoom=NaN;},
 get layers(){return caseLayers;},
 resources(){return {textures:renderer.info.memory.textures+focusRenderer.info.memory.textures,geometries:renderer.info.memory.geometries+focusRenderer.info.memory.geometries};},
 exit(){caseLayers?.dispose();caseLayers=null;return caseSurface.exit().then(result=>{queueSceneResize();return result;});}});
 addEventListener('pagehide',()=>caseSurface.dispose(),{once:true});
}

function render(time){
 if(!sceneReady)return;
 requestAnimationFrame(render);
 if(gridView||document.documentElement.dataset.caseStudyPaused||(document.documentElement.dataset.caseStudyActive&&!caseLayers)){lastFrame=time;return;}
 if(document.documentElement.dataset.caseStudyActive&&caseLayers&&!caseLayers.dirty&&!resizePending){lastFrame=time;return;}
 if(resizePending){resizePending=false;staticFramePainted=false;resizeScene();}
 // Hold the tablet still behind the phone notice. The CSS sweep runs independently.
 if(staticPreview()&&staticFramePainted){lastFrame=time;return;}
 if(document.hidden||(!stageVisible&&!movingTween&&!shelfTurn)){lastFrame=time;return;}
 const lightweight=mobilePreviewMedia.matches;
 if(lightweight&&time-lastRendered<1000/60-1)return;lastRendered=time;
 const delta=Math.min(.055,(time-lastFrame)/1000||.016);
 lastFrame=time;tickTween(time);tickShelfTurn(time);
 accentCurrent.lerp(accentTarget,1-Math.exp(-delta*2.4));
 lightAccent.color.copy(accentCurrent);if(glowSprite)glowSprite.material.color.copy(accentCurrent);
 accentReactiveMaterials.forEach(m=>m.color.copy(accentCurrent));
 const activeId=modal?.open?null:(state==='gallery'?hovered:(state==='closing'?null:selected?.id));
 const targetAmbient=state==='focus'?0.92:(activeId?1.02:0.90);
 const targetKey=state==='focus'?0.98:(activeId?1.18:0.94);
 ambientLight.intensity = damp(ambientLight.intensity,targetAmbient,Math.min(1,delta*4.0),Math.min(1,delta*1.25));
 lightKey.intensity = damp(lightKey.intensity,targetKey,Math.min(1,delta*4.0),Math.min(1,delta*1.25));
 scene.environmentIntensity = damp(scene.environmentIntensity,((activeId||state==='focus')?0.18:0.11),Math.min(1,delta*3.4),Math.min(1,delta*1.05));
 for(const p of PROJECTS){
  const d=displayItems.get(p.id),targetHover=state==='gallery'&&!shelfTurn&&hovered===p.id?1:0;
  const onVisibleFace=!lightweight||Boolean(shelfTurn)||projectSide(p)===gallerySide;
  d.group.visible=onVisibleFace;
  d.contact.visible=onVisibleFace;
  d.cast.mesh.visible=onVisibleFace;
  const rig=exhibitSpots.get(p.id);
  // Keep desktop light counts stable through a turn to reuse shader programs.
  rig.spot.visible=!lightweight;
  d.screenLight.visible=!lightweight;
  if(!onVisibleFace){
   rig.beam.visible=rig.ring.visible=rig.flare.visible=rig.particles.visible=false;
   continue;
  }
  const targetDim=activeId&&activeId!==p.id?1:0;
  d.contact.material.opacity=damp(d.contact.material.opacity,selected===p?0:1,Math.min(1,delta*9),Math.min(1,delta*9));
  d.hoverAmount = motionReduced()?0:damp(d.hoverAmount,targetHover,1-Math.exp(-delta*6),1-Math.exp(-delta*2.2));
  d.lightAmount=damp(d.lightAmount,activeId===p.id?1:0,1-Math.exp(-delta*(motionReduced()?28:6.0)),1-Math.exp(-delta*(motionReduced()?28:2.2)));
  if(d.lightAmount<.0001&&activeId!==p.id)d.lightAmount=0;
  d.dimAmount = damp(d.dimAmount,targetDim,Math.min(1,delta*6.2),Math.min(1,delta*1.85));
  const isFocus=selected?.id===p.id && state!=='gallery';
  const bodyBrightness=isFocus?1.12:(.80+.28*d.lightAmount-.30*d.dimAmount);
  d.group.traverse(o=>{
   if(!o.isMesh||!o.material?.userData.baseColor)return;
   if(o.userData.isScreen)return;
   o.material.color.copy(o.material.userData.baseColor).multiplyScalar(bodyBrightness);
  });
  if(d.screenLight){
    const targetLight=isFocus?(p.device==='monitor'?3.9:3.0):(.18+d.lightAmount*(p.device==='monitor'?2.32:1.72));
    d.screenLight.intensity = damp(d.screenLight.intensity,targetLight,Math.min(1,delta*7.0),Math.min(1,delta*3.2));
  }
  if(rig){
   const amount=rig.amount=d.lightAmount;
   rig.spot.intensity=amount*(p.device==='monitor'?110:96);
   rig.ring.visible=rig.flare.visible=amount>.001;
   rig.beam.visible=!lightweight&&amount>.001;
   rig.ring.material.opacity=amount;
   rig.beam.material.uniforms.uOpacity.value=amount*.48;
   rig.flare.material.opacity=amount*.72;
   if(rig.beam.visible)alignSoftBeam(rig.beam);
   rig.particles.visible=!lightweight&&!motionReduced()&&amount>.001;
   rig.particles.material.uniforms.uTime.value=(time-initialTime)/1000;
   rig.particles.material.uniforms.uOpacity.value=amount*.52;
   rig.particles.material.uniforms.uPixelRatio.value=renderer.getPixelRatio();
  }
 }
 const now=time-initialTime;
 if(state==='gallery'&&!movingTween&&!shelfTurn){
  const px=lightweight||motionReduced()?0:lastPointer.x*.08,py=lightweight||motionReduced()?0:lastPointer.y*.05;
  camera.position.x+=(px-camera.position.x)*Math.min(1,delta*1.8);
  camera.position.y+=((startLook.y+py)-camera.position.y)*Math.min(1,delta*1.8);
  camera.lookAt(cameraTarget);
  PROJECTS.forEach((p,i)=>{
   const d=displayItems.get(p.id);
   if(!d.group.visible)return;
   const reveal=motionReduced()?1:Math.max(0,Math.min(1,(now-120-i*130)/650));
   const center=d.group.getWorldPosition(new THREE.Vector3()).project(camera);
   const magnetic=!motionReduced()&&pointerInGallery&&hovered===p.id;
   const mx=magnetic?clamp((lastPointer.x-center.x)*2.8,-1,1):0;
   const my=magnetic?clamp((lastPointer.y-center.y)*2.8,-1,1):0;
   const mk=1-Math.exp(-delta*7);
   d.magnet.x=THREE.MathUtils.lerp(d.magnet.x,mx,mk);d.magnet.y=THREE.MathUtils.lerp(d.magnet.y,my,mk);
   d.group.visible=reveal>0;
   const r=1-Math.pow(1-reveal,3);
   d.group.scale.setScalar(p.scene.scale*(.94+.06*r)*(1+.058*d.hoverAmount));
   d.group.position.x=d.homePosition.x+d.magnet.x*.085;
   d.group.position.y=d.homePosition.y-.16*(1-r)+(lightweight||motionReduced()?0:Math.sin(time*.00042+i)*.012)+d.hoverAmount*.095+d.magnet.y*.045;
   d.group.position.z=d.homePosition.z+d.hoverAmount*.37;
   d.group.quaternion.copy(d.homeQuaternion);
   if(d.hoverAmount>.001)d.group.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-d.magnet.y*.045,(-.055+d.magnet.x*.085)*d.hoverAmount,0)));
  });
 }
 if(state==='focus'&&selected&&(!caseSurface||caseSurface.status==='idle')){
  if(!movingTween&&selectedBaseQuaternion){
   const d=displayItems.get(selected.id);
   focusTilt.x+=(focusTiltTarget.x-focusTilt.x)*Math.min(1,delta*5.6);
   focusTilt.y+=(focusTiltTarget.y-focusTilt.y)*Math.min(1,delta*5.6);
   const qx=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),focusTilt.x);
   const qy=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),focusTilt.y);
   demoBlend=motionReduced()?(previewActive?1:0):THREE.MathUtils.lerp(demoBlend,previewActive?1:0,1-Math.exp(-delta*8));
   if(staticPreview()){
    d.group.quaternion.copy(camera.quaternion);
   }else{
    d.group.quaternion.copy(selectedBaseQuaternion).slerp(new THREE.Quaternion(),demoBlend*.92).multiply(qy).multiply(qx);
   }
  }
 }
// Project against the current frame, before either renderer updates world matrices.
 environmentZoom=motionReduced()?environmentZoomTarget:THREE.MathUtils.lerp(environmentZoom,environmentZoomTarget,1-Math.exp(-delta*9));
 camera.zoom=staticPreview()?1:environmentZoom*(1+.055*demoBlend);camera.updateProjectionMatrix();
 camera.updateMatrixWorld(true);
 if(state==='focus'&&selected&&(!caseSurface||caseSurface.status==='idle')){
  const device=displayItems.get(selected.id);
  const scaleFactor=staticPreview()?1:1+.035*demoBlend;
  const layout=focusLayout(selected,camera,device.group.quaternion,selected.camera.scale*scaleFactor);
  device.group.position.copy(layout.position);
  device.group.scale.setScalar(layout.scale);
 }
 caseSurface?.tick(time);
 caseLayers?.refresh();
 for(const [id,device] of displayItems){
  if(device.cast.mesh.visible)updateCastShadow(device,exhibitSpots.get(id),device.group.parent===scene);
 }
 scene.updateMatrixWorld(true);
 if(caseLayers)window.dispatchEvent(new CustomEvent('case-study:anchors',{detail:caseLayers.anchors()}));
 renderLabels(time);
 positionScreenPortal();
 if(glowSprite)glowSprite.material.opacity=0;
 camera.layers.set(0);
 // The phone's room can stay painted while the foreground exhibit rotates.
 if(!lightweight||state!=='focus'||time<backdropSettlesAt||dragOrbit||Math.abs(focusTilt.x-focusTiltTarget.x)+Math.abs(focusTilt.y-focusTiltTarget.y)>.001||!(Math.abs(backdropZoom-camera.zoom)<.001)){
  renderer.render(scene,camera);
  backdropZoom=camera.zoom;
 }
 if(activeLayerOn){camera.layers.set(ACTIVE_LAYER);focusRenderer.render(scene,camera);camera.layers.set(0);}
 staticFramePainted=staticPreview();
}


function installKeys(){document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state!=='gallery'){e.preventDefault();closeProject()}else if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&state==='focus'&&!modal?.open){const projects=PROJECTS.filter(p=>projectSide(p)===gallerySide),n=projects.length,i=projects.findIndex(p=>p.id===selected.id),j=(i+(e.key==='ArrowRight'?1:-1)+n)%n;queuedSelection=projects[j].id;closeProject()}});closeButton.addEventListener('click',closeProject);
 // Dismiss even when the user clicks outside the showroom frame (page header/archive).
 document.addEventListener('pointerdown',event=>{
  if(state!=='focus'||event.button!==0||!inspector.classList.contains('is-open'))return;
  if(inspector.contains(event.target)||event.target.closest('#screen-portal')||focusHost.contains(event.target)||event.target.closest('.stage-actions,#try-preview,#shelf-switch'))return;
  closeProject();
 });
 resetButton.addEventListener('click',closeProject);}
function showFallback(detail){
 caseLayers?.dispose();caseLayers=null;
 window.dispatchEvent(new Event('case-study:fallback'));
 caseSurface?.dispose();
 graphicsUnavailable = true;
 sceneReady = false;
 const button = $('button[data-project-view="3d"]');
 const restoreFocus = document.activeElement === button || frame.contains(document.activeElement);
 button.disabled = true;
 shelfSwitch.hidden = true;
 clearOutline();
 $('#screen-portal').hidden = true;
 renderer?.dispose();
 focusRenderer?.dispose();
 stageLoading.classList.add('is-done');
 $('#project-view-status').textContent = '3D is unavailable on this device. Browse projects in Grid View.';
 if(detail) console.warn('[showroom] fallback:', detail);
 setProjectView(true);
 if(restoreFocus) $('button[data-project-view="grid"]').focus();
}

let engineLoad;
function loadEngine(){
 return engineLoad ??= new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = new URL('./vendor/three.js', import.meta.url).href;
  script.onload = resolve;
  script.onerror = () => reject(new Error('Local Three.js engine did not load'));
  document.head.append(script);
 });
}

async function initialize(){
 try {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  const capable = gl && gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 4096;
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  if(!capable) throw new Error('WebGL 2 or required texture capacity unavailable');
  await loadEngine();
  if(gridView) return;
  THREE = window.SHOWROOM_THREE;
  if(!THREE) throw new Error('Local Three.js engine did not load');
  makeScene();
  frame.appendChild($('#try-preview'));
  setupInteraction();
  stageLoading.classList.add('is-done');
  window.addEventListener('resize', queueSceneResize, {passive:true});
  new ResizeObserver(queueSceneResize).observe(frame);
  new IntersectionObserver(entries => {
   stageVisible = entries.at(-1).isIntersecting;
  }, {rootMargin:'150px'}).observe(frame);
 } catch(error) {
  showFallback(error.message);
 }
}

function setProjectView(useGrid, explicit = false){
 if(useGrid && sceneReady) closeProject();
 gridView = useGrid || graphicsUnavailable;
 document.documentElement.dataset.projectLayout = gridView ? 'grid' : '3d';
 document.querySelector('.museum-section').hidden = gridView;
 for (const button of document.querySelectorAll('button[data-project-view]')) {
  button.setAttribute('aria-pressed', String((button.dataset.projectView === 'grid') === gridView));
 }
 if(explicit && (useGrid || !graphicsUnavailable)){
  const view = gridView ? 'grid' : '3d';
  try { localStorage.setItem('portfolio-project-view', view); } catch {}
  const url = new URL(location.href);
  url.searchParams.set('view', view);
  history.replaceState(null, '', url);
 }
 if(!gridView && !sceneReady && !initialization){
  initialization = initialize().finally(() => { initialization = undefined; });
 }
 if(!gridView && sceneReady) queueSceneResize();
}
function openLinkedProject(){
 const id = location.hash.match(/^#project[/-](.+)$/)?.[1];
 const project=ARCHIVE_PROJECTS.find(p=>p.slug===id||p.id===id);
 if(project)openAccessibleDetail(project);
 else if(modal?.open)modal.close();
}
buildArchive();installKeys();
for (const button of document.querySelectorAll('button[data-project-view]')) {
 button.disabled = false;
 button.addEventListener('click', () => setProjectView(button.dataset.projectView === 'grid', true));
}
window.addEventListener('hashchange',openLinkedProject);
window.addEventListener('popstate',openLinkedProject);
setProjectView(gridView);
openLinkedProject();

