
/**
 * Real projects and actual artwork paths inspected from:
 * https://github.com/GiorgiGiorgadze18/PortfolioWebsite/blob/main/projects.html
 * No fabricated project screens. Device models are original procedural geometry.
 *
 * Artwork uses repository-local assets; the supplied v0.14 source is preserved in
 * portfolio-3d-showroom-test-v14.zip. See docs/SHOWROOM.md for integration details.
 */

const PROJECTS = [
  {
    id:'tsero',name:'Tsero App',shortName:'TSERO',category:'uiux',categoryLabel:'Mobile App · UI/UX',year:'2026',device:'phone',cover:'project-tsero.jpg',screenshots:['project-tsero.jpg'],accent:'#FF3316',
    description:'The name “Tsero” comes from the Georgian word for stork, symbolizing delivery, movement and speed. The app explores modern, user-centered food ordering with browsing, courier tracking, checkout, payment, and profile settings. Branding, logo, color system, UI/UX and interactive prototyping were designed by Giorgi Giorgadze. This is a personal portfolio concept.',
    scene:{position:[-3.25,-.2,.47],rotation:[-.12,.28,-.04],scale:1},camera:{position:[0,.28,9.6],focusPosition:[-1.75,-.06,3.55],scale:1.34},interactiveUrl:null
  },
  {
    id:'tomford',name:'Tom Ford Tobacco Vanille',shortName:'TOBACCO VANILLE',category:'graphics',categoryLabel:'Product Visual · Graphics',year:'2025',device:'monitor',cover:'project-tomford.png',screenshots:['project-tomford.png'],accent:'#C08A55',
    description:'A Photoshop product-visual composition exploring warm tobacco and vanilla tones through lighting, texture and smoke. The artwork emphasizes color harmony and visual depth around the fragrance. This is an independently created design exercise, not an official brand campaign.',
    scene:{position:[1.53,1.10,-.55],rotation:[-.03,-.18,.01],scale:.93},camera:{position:[0,.3,9.5],focusPosition:[-1.30,.02,3.2],scale:1.18},interactiveUrl:null
  },
  {
    id:'jbl',name:'MeeTab',shortName:'MEETAB',category:'uiux',categoryLabel:'Interactive App · Web Preview',year:'2026',device:'tablet',cover:"meetab-preview.jpg",screenshots:['project-jbl.png'],accent:'#51BCE5',
    description:'MeeTab meeting-room app. Try its navigation, calendar, local sample bookings and animations inside the tablet. Portfolio demo uses sample data; account access is disabled.',
    scene:{position:[-.95,-.84,.55],rotation:[-.13,-.16,.035],scale:.98},camera:{position:[0,.3,9.6],focusPosition:[-1.60,-.08,3.35],scale:1.35},interactiveUrl:null
  },
  {
    id:'earthhour',name:'Earth Hour Campaign Poster',shortName:'EARTH HOUR',category:'graphics',categoryLabel:'Poster Design · Graphics',year:'2025',device:'poster',cover:'project-earthhour.png',screenshots:['project-earthhour.png'],accent:'#94B57B',
    description:'A vector campaign poster created in Adobe Illustrator, emphasizing custom shape building, vector path precision and controlled typography. The composition is designed for scalable print and digital presentation. Independent portfolio work.',
    scene:{position:[3.82,-.30,.25],rotation:[-.02,-.12,-.01],scale:.87},camera:{position:[0,.3,9.5],focusPosition:[-1.56,.05,3.38],scale:1.33},interactiveUrl:null
  }
];
const JBL_ARTWORK = {id:'jbl-artwork',name:'JBL Premium Audio Campaign',shortName:'JBL',category:'graphics',categoryLabel:'Advertising · Graphics',year:'2025',device:'artwork',cover:'project-jbl.png',description:'JBL Premium Audio Campaign — advertising visual by Giorgi Giorgadze. Independent portfolio work.'};
const ARCHIVE_PROJECTS = [...PROJECTS, JBL_ARTWORK];
const LOCAL_BASE = ['http:','https:','file:'].includes(location.protocol) ? new URL('./assets/',location.href).href : './assets/';

const assetUrl=(filename)=>filename.startsWith('data:')?filename:window.SHOWROOM_EMBEDDED_ASSETS?.[filename]||`${window.SHOWROOM_ASSET_BASE||LOCAL_BASE}${encodeURIComponent(filename)}`;
const assetFallbacks = (filename) => [assetUrl(filename)];


const $=s=>document.querySelector(s);
const sceneHost=$('#showroom-canvas'), frame=$('#museum-frame'), labelsEl=$('#device-labels');
const stageLoading=$('#stage-enter'), fallbackEl=$('#stage-fallback');
const projectGrid=$('#project-grid'), inspector=$('#project-inspector');
const closeButton=$('#inspector-close'), resetButton=$('#reset-view');
const halo=$('#ambient-halo');
const focusHost=$('#focus-canvas'), screenHost=$('#screen-overlays'), focusScreenHost=$('#focus-screen-overlays');
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
let pointerInGallery=false, relay=null, keyboardHovered=null, pointerHovered=null;
let environmentZoom=1,environmentZoomTarget=1,previewActive=false;
reduceMotionMedia.addEventListener('change',()=>{
 if(!motionReduced())return;
 pointerInGallery=false;focusTilt.x=focusTilt.y=focusTiltTarget.x=focusTiltTarget.y=0;
 displayItems.forEach(d=>{d.magnet.x=d.magnet.y=0;});
 if(movingTween)tickTween(movingTween.start+movingTween.duration);
});
const compactView=()=>matchMedia('(max-width:600px)').matches;
let focusScale=1,stageVisible=true,lastRendered=0,resizePending=false;
const GALLERY_PIXEL_RATIO=innerWidth<900?1.0:1.18;
const FOCUS_PIXEL_RATIO=innerWidth<900?1.15:1.58;

function setAccent(hex){frame.style.setProperty('--active-light',hex);halo.style.background=`radial-gradient(ellipse 46% 54% at 48% 48%, ${hex}19, transparent 70%)`;if(THREE&&accentTarget) accentTarget.set(hex);}
function setMenu(){const toggle=$('#menu-toggle'),menu=$('#mobile-menu');toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.hidden=open;});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false')}));window.addEventListener('scroll',()=>$('#navbar').classList.toggle('is-scrolled',scrollY>16),{passive:true})}
function archiveCard(p){const article=document.createElement('article');article.className='archive-card';article.setAttribute('role','listitem');article.dataset.category=p.category;article.innerHTML=`<div class="archive-thumb"><img loading="lazy" src="${assetUrl(p.cover)}" alt="${p.name} original design artwork"></div><div class="archive-info"><span class="archive-kind">${p.categoryLabel.toUpperCase()}</span><h3>${p.name}</h3><p>${p.year} · ${p.device.toUpperCase()} DISPLAY</p><button type="button" class="archive-action" data-explore="${p.id}">EXPLORE PROJECT &nbsp; ↗</button></div>`;const img=article.querySelector('img');let candidateIndex=0;const candidateUrls=assetFallbacks(p.cover);img.src=candidateUrls[0];img.addEventListener('error',()=>{candidateIndex++;if(candidateIndex<candidateUrls.length){img.src=candidateUrls[candidateIndex];return;}img.hidden=true;const note=document.createElement('span');note.className='archive-image-unavailable';note.textContent='Artwork not loaded · '+p.shortName;article.querySelector('.archive-thumb').append(note)});article.querySelector('button').addEventListener('click',()=>chooseProject(p.id));return article;}
function buildArchive(){ARCHIVE_PROJECTS.forEach(p=>projectGrid.append(archiveCard(p)));document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>{x.classList.toggle('is-active',x===b);x.setAttribute('aria-pressed',String(x===b))});projectGrid.querySelectorAll('.archive-card').forEach(card=>{card.hidden=b.dataset.filter!=='all'&&card.dataset.category!==b.dataset.filter;});}));}
let modal;
function openAccessibleDetail(p){if(!modal){modal=document.createElement('dialog');modal.className='mobile-project-dialog';modal.innerHTML='<div class="mobile-project-inner"><button class="mobile-dialog-close" type="button" aria-label="Close">×</button><p class="mobile-dialog-kicker"></p><h2></h2><div class="mobile-dialog-art"><img alt=""></div><p class="mobile-dialog-description"></p><a class="mobile-dialog-link" target="_blank" rel="noopener noreferrer">VIEW ORIGINAL ARTWORK ↗</a></div>';document.body.append(modal);modal.querySelector('button').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});const s=document.createElement('style');s.textContent='.mobile-project-dialog{border:1px solid rgba(208,188,255,.32);border-radius:13px;box-shadow:0 30px 100px rgba(0,0,0,.8);background:#0A0E1A;color:white;max-width:min(660px,calc(100vw - 32px));max-height:90vh;padding:0}.mobile-project-dialog::backdrop{background:rgba(3,5,12,.86);backdrop-filter:blur(10px)}.mobile-project-inner{padding:25px;position:relative}.mobile-dialog-close{position:absolute;right:13px;top:11px;font-size:26px;border:0;background:transparent;color:white}.mobile-dialog-kicker{font-size:10px;color:#D0BCFF;letter-spacing:.18em}.mobile-project-inner h2{font:800 26px Inter,sans-serif;margin:8px 0 20px;line-height:1.2}.mobile-dialog-art{display:flex;justify-content:center;background:#050711;max-height:42vh}.mobile-dialog-art img{max-height:42vh;max-width:100%;object-fit:contain}.mobile-dialog-description{color:rgba(255,255,255,.7);font:400 13px/1.7 Inter,sans-serif}.mobile-dialog-link{display:inline-block;margin-top:9px;padding:11px 16px;border:1px solid #D0BCFF;color:#D0BCFF;border-radius:30px;font:700 10px Space Grotesk,sans-serif}';document.head.append(s)}modal.querySelector('.mobile-dialog-kicker').textContent=p.categoryLabel.toUpperCase()+' · '+p.year;modal.querySelector('h2').textContent=p.name;const img=modal.querySelector('img');img.src=assetUrl(p.cover);img.alt=p.name+' artwork';modal.querySelector('.mobile-dialog-description').textContent=p.description;modal.querySelector('.mobile-dialog-link').href=assetUrl(p.cover);if(!modal.open)modal.showModal();}

function roundedShape(w,h,r){const s=new THREE.Shape();const l=-w/2,b=-h/2; r=Math.min(r,w/2,h/2);s.moveTo(l+r,b);s.lineTo(l+w-r,b);s.quadraticCurveTo(l+w,b,l+w,b+r);s.lineTo(l+w,b+h-r);s.quadraticCurveTo(l+w,b+h,l+w-r,b+h);s.lineTo(l+r,b+h);s.quadraticCurveTo(l,b+h,l,b+h-r);s.lineTo(l,b+r);s.quadraticCurveTo(l,b,l+r,b);return s;}
function clamp(v,min,max){return Math.min(max,Math.max(min,v))}
function damp(current,target,rise,fall){const k=target>current?rise:fall;return current+(target-current)*k;}
function surfaceMaterial(options){
 if(!compactView())return new THREE.MeshPhysicalMaterial(options);
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
 const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape,32),mat);
 mesh.position.z=depth;mesh.userData.projectId=p.id;mesh.userData.isScreen=true;
 mesh.renderOrder=4;meshes.push(mesh);return mesh;
}
function useOriginalArtwork(mesh,p,w,h){
 const cn=document.createElement('canvas'),size=compactView()?512:1024;
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
 const texture=new THREE.CanvasTexture(cn);
 texture.colorSpace=THREE.SRGBColorSpace;
 texture.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());
 texture.minFilter=THREE.LinearMipmapLinearFilter;
 texture.magFilter=THREE.LinearFilter;
 texture.generateMipmaps=true;
 mesh.material.map=texture;mesh.material.color.set('#ffffff');mesh.material.needsUpdate=true;
 const candidates=assetFallbacks(p.cover);
 const loadCandidate=(idx=0)=>{
  if(idx>=candidates.length){renderPlaceholder('ORIGINAL IMAGE UNAVAILABLE');texture.needsUpdate=true;return;}
  const image=new Image();image.decoding='async';image.crossOrigin='anonymous';
  image.onload=()=>{
   ctx.clearRect(0,0,cw,ch);
   const cover=Math.max(cw/image.width,ch/image.height);
   const dw=image.width*cover,dh=image.height*cover;
   const dx=(cw-dw)/2,dy=(ch-dh)/2;
   ctx.save();
   ctx.drawImage(image,dx,dy,dw,dh);
   ctx.restore();
   const edgeShade=ctx.createLinearGradient(0,0,0,ch);edgeShade.addColorStop(0,'rgba(255,255,255,.06)');edgeShade.addColorStop(.18,'rgba(255,255,255,.02)');edgeShade.addColorStop(1,'rgba(0,0,0,.10)');ctx.fillStyle=edgeShade;ctx.fillRect(0,0,cw,ch);
   const gloss=ctx.createLinearGradient(0,0,cw,ch);gloss.addColorStop(0,'rgba(255,255,255,.08)');gloss.addColorStop(.18,'rgba(255,255,255,.03)');gloss.addColorStop(.52,'rgba(255,255,255,0)');ctx.fillStyle=gloss;ctx.fillRect(0,0,cw,ch*.7);
   texture.needsUpdate=true;mesh.userData.artworkReady=true;
  };
  image.onerror=()=>loadCandidate(idx+1);
  image.src=candidates[idx];
 };
 loadCandidate(0);
}


function addProjectHit(group,p){group.traverse(o=>{if(o.isMesh){o.userData.projectId=p.id;meshes.push(o)}})}
function deviceFactory(p){const group=new THREE.Group();const colorMat=metal();let w,h,d;
 switch(p.device){case'phone':w=1.12;h=2.24;d=.11;break;case'tablet':w=2.3;h=1.5175;d=.09;break;case'monitor':w=2.68;h=1.64;d=.13;break;default:w=1.65;h=2.18;d=.095;}
 const body=roundedPlate(w,h,d,p.device==='phone'?.19:.12,colorMat);group.add(body);
 const bezel=roundedPlate(w-.09,h-.09,.028,p.device==='phone'?.14:.09,surfaceMaterial({color:'#111520',metalness:.18,roughness:.88,clearcoat:.05}));bezel.position.z=.045;group.add(bezel);
 const sw=w-(p.device==='phone'?.15:.16),sh=h-(p.device==='phone'?.22:.18);
 const recess=new THREE.Mesh(new THREE.ShapeGeometry(roundedShape(sw+.07,sh+.07,screenRadius(sw,sh,p)+.035),32),new THREE.MeshBasicMaterial({color:'#06080E'}));recess.position.z=.081;group.add(recess);
 const surface=screenSurface(sw,sh,p,.104);group.add(surface);useOriginalArtwork(surface,p,sw,sh);
 const glassMat=surfaceMaterial({color:'#ffffff',metalness:0,roughness:.03,transparent:true,opacity:.02,clearcoat:1,clearcoatRoughness:.05,reflectivity:.38,ior:1.46,depthWrite:false});glassMat.dithering=true;
 const glass=new THREE.Mesh(new THREE.ShapeGeometry(roundedShape(sw,sh,screenRadius(sw,sh,p)),32),glassMat);glass.position.z=.114;group.add(glass);
 const screenBloom=new THREE.Sprite(new THREE.SpriteMaterial({map:makeGlowTexture(),color:'#ffffff',transparent:true,opacity:.08,depthWrite:false,blending:THREE.AdditiveBlending}));screenBloom.position.set(0,0,.118);screenBloom.scale.set(sw*1.18,sh*1.18,1);group.add(screenBloom);
 const screenLight=new THREE.PointLight('#ffffff',0.16,p.device==='monitor'?4.4:(p.device==='tablet'?3.5:3),2);screenLight.position.set(0,0,.72);screenLight.visible=!compactView();group.add(screenLight);
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
  const stand=new THREE.Mesh(new THREE.BoxGeometry(1.4,.09,.4),surfaceMaterial({map:grainTexture('walnut'),color:'#A78F7C',metalness:.06,roughness:.55,clearcoat:.12}));stand.position.set(0,-h/2-.1,-.16);stand.rotation.x=.15;group.add(stand);
 }
 if(p.device==='poster'){
  const foot=new THREE.Mesh(new THREE.BoxGeometry(.88,.07,.5),surfaceMaterial({map:grainTexture('walnut'),color:'#A78F7C',metalness:.05,roughness:.58,clearcoat:.12}));foot.position.set(0,-h/2-.09,-.1);foot.castShadow=true;group.add(foot);
  const spine=new THREE.Mesh(new THREE.BoxGeometry(.06,1.2,.09),material('#8F7B63',.78,.33));spine.position.set(0,-.65,-.08);group.add(spine);
 }
 group.position.set(...p.scene.position);group.rotation.set(...p.scene.rotation);group.scale.setScalar(p.scene.scale);addProjectHit(group,p);
 group.traverse(obj=>{if(obj.isMesh&&obj.material?.color){obj.material.userData.baseColor=obj.material.color.clone();}});
 return {hoverAmount:0,dimAmount:0,lightAmount:0,magnet:{x:0,y:0},project:p,group,screen:surface,screenBloom,screenLight,homePosition:group.position.clone(),homeQuaternion:group.quaternion.clone(),homeScale:p.scene.scale,screenDimensions:{w:sw,h:sh}};
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
 axis.subVectors(end,origin).normalize();view.subVectors(camera.position,origin).normalize();
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
function buildLightRelay(){
 const material=new THREE.ShaderMaterial({
  uniforms:{uOpacity:{value:0},uColor:{value:new THREE.Color('#D0BCFF')}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`varying vec2 vUv;uniform float uOpacity;uniform vec3 uColor;
   void main(){vec2 p=(vUv-0.5)*2.0;float a=exp(-p.x*p.x*4.0-p.y*p.y*5.0);
    a*=1.0-smoothstep(0.65,1.0,max(abs(p.x),abs(p.y)));
    gl_FragColor=vec4(uColor,a*uOpacity);}`,
  transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false
 });
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.65,.20),material);
 mesh.rotation.x=-Math.PI/2;mesh.position.set(-5.6,-1.389,-1.455);scene.add(mesh);
 relay={mesh,lastId:null,targetX:-5.6,amount:0,age:0,colorTarget:new THREE.Color('#D0BCFF')};
}
function updateLightRelay(activeId,delta){
 if(!relay)return;
 if(activeId!==relay.lastId){
  relay.lastId=activeId;
  const project=PROJECTS.find(p=>p.id===activeId);
  if(project){relay.targetX=project.scene.position[0];relay.colorTarget.set(project.accent);relay.age=0;}
 }
 relay.age+=delta;
 const reduced=motionReduced(),k=1-Math.exp(-delta*(reduced?28:7));
 relay.mesh.position.x=reduced?relay.targetX:THREE.MathUtils.lerp(relay.mesh.position.x,relay.targetX,k);
 relay.amount=THREE.MathUtils.lerp(relay.amount,activeId?1:0,k);
 relay.mesh.material.uniforms.uColor.value.lerp(relay.colorTarget,k);
 relay.mesh.material.uniforms.uOpacity.value=relay.amount*(reduced?.18:(.16+.72*Math.exp(-relay.age*1.5)));
}
function makeShadowTexture(){
 if(shadowTexture)return shadowTexture;
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');
 const grad=ctx.createRadialGradient(128,128,12,128,128,126);grad.addColorStop(0,'rgba(0,0,0,.36)');grad.addColorStop(.48,'rgba(0,0,0,.18)');grad.addColorStop(1,'rgba(0,0,0,0)');
 ctx.fillStyle=grad;ctx.fillRect(0,0,256,256);shadowTexture=new THREE.CanvasTexture(c);return shadowTexture;
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
 const wall=new THREE.MeshStandardMaterial({map:grainTexture('linen'),color:'#A5A6B8',metalness:.06,roughness:.82,bumpMap:grainTexture('linen'),bumpScale:.035});
 const back=new THREE.Mesh(new THREE.BoxGeometry(14,6.3,.35),wall);
 back.position.set(0,.05,-2.25);back.receiveShadow=true;scene.add(back);
 const floor=new THREE.Mesh(new THREE.BoxGeometry(17,.12,4.4),material('#252A37',.48,.43));
 floor.position.set(0,-2.02,-.3);floor.receiveShadow=true;scene.add(floor);
 // Warm satin walnut shelves, champagne bronze edging, cool lavender lights.
 const walnut=surfaceMaterial({map:grainTexture('walnut'),color:'#BBA390',roughness:.48,metalness:.08,clearcoat:.17,bumpMap:grainTexture('walnut'),bumpScale:.025});
 const brass=material('#947B5D',.77,.28);
 for(const [y,shelfWidth,shelfX,shelfZ] of [[-1.5,12.1,0,-.78],[-.36,3.45,1.52,-.82]]){
  const shelf=new THREE.Mesh(new THREE.BoxGeometry(shelfWidth,.2,1.45),walnut);
  shelf.position.set(shelfX,y,shelfZ);shelf.castShadow=true;shelf.receiveShadow=true;scene.add(shelf);
  const edge=new THREE.Mesh(new THREE.BoxGeometry(shelfWidth,.038,.04),brass);
  edge.position.set(shelfX,y+.093,shelfZ+.72);scene.add(edge);
  const lip=new THREE.Mesh(new THREE.BoxGeometry(shelfWidth,.035,.08),material('#444153',.58,.3));
  lip.position.set(shelfX,y-.074,shelfZ+.744);scene.add(lip);
  const ledMat=new THREE.MeshBasicMaterial({color:'#D0BCFF'});
  const led=new THREE.Mesh(new THREE.BoxGeometry(shelfWidth-.12,.012,.022),ledMat);
  led.position.set(shelfX,y-.105,shelfZ+.77);scene.add(led);accentReactiveMaterials.push(ledMat);
  const rearLedMat=new THREE.MeshBasicMaterial({color:'#A79AF8'});
  const rearLed=new THREE.Mesh(new THREE.BoxGeometry(shelfWidth-.18,.010,.018),rearLedMat);
  rearLed.position.set(shelfX,y+.106,shelfZ-.68);scene.add(rearLed);accentReactiveMaterials.push(rearLedMat);
  const rearGlow=new THREE.Mesh(new THREE.PlaneGeometry(shelfWidth-.2,.18),new THREE.MeshBasicMaterial({color:'#A79AF8',transparent:true,opacity:.055,depthWrite:false}));
  rearGlow.position.set(shelfX,y-.01,shelfZ-.715);scene.add(rearGlow);accentReactiveMaterials.push(rearGlow.material);
 }
 for(const x of [-5.95,0,5.95]){
  const col=new THREE.Mesh(new THREE.BoxGeometry(.11,5.55,.64),material('#5B5260',.7,.38));
  col.position.set(x,-.15,-1.65);scene.add(col);
  const inset=new THREE.Mesh(new THREE.BoxGeometry(.024,5.3,.01),brass);
  inset.position.set(x+.057,-.15,-1.308);scene.add(inset);
 }
 const horiz=new THREE.Mesh(new THREE.BoxGeometry(12,.09,.24),brass);
 horiz.position.set(0,2.3,-1.66);scene.add(horiz);
 for(let i=0;i<8;i++){
  const rail=new THREE.Mesh(new THREE.BoxGeometry(.018,3,.016),material(i%2?'#4A4455':'#3A3747',.58,.46));
  rail.position.set(-5.15+i*1.47,0,-2.025);scene.add(rail);
 }
 const backGlowMat=new THREE.MeshBasicMaterial({color:'#9272CD',transparent:true,opacity:.04,depthWrite:false});
 const backGlow=new THREE.Mesh(new THREE.PlaneGeometry(10,4.4),backGlowMat);
 backGlow.position.set(0,0,-2.012);scene.add(backGlow);accentReactiveMaterials.push(backGlowMat);
 const wallWash=new THREE.Mesh(new THREE.PlaneGeometry(12.6,4.9),new THREE.MeshBasicMaterial({map:makeShadowTexture(),transparent:true,opacity:.16,depthWrite:false}));
 wallWash.position.set(0,-.48,-1.99);wallWash.scale.set(1.22,1.1,1);scene.add(wallWash);
 // Soft baked contact occlusion complements real-time shadow maps without a heavy SSAO pass.
 const shadowMap=makeShadowTexture();
 for(const project of PROJECTS){
  const [x,y,z]=project.scene.position;
  const shelfY=(project.id==='tomford')?-.255:-1.38;
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(project.device==='monitor'?2.75:1.68,.95),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));
  shadow.rotation.x=-Math.PI/2;shadow.position.set(x,shelfY,z-.20);shadow.scale.set(1.04,1,1);scene.add(shadow);
 }

}
function buildShowroomSpots(){
 const softMap=makeGlowTexture();
 for(const [index,p] of PROJECTS.entries()){
  const [x]=p.scene.position;
  const top=2.94,fixtureZ=-.45;
  const fixture=new THREE.Mesh(new THREE.CylinderGeometry(.205,.235,.19,48),material('#A18C72',.67,.33));
  fixture.position.set(x,top,fixtureZ);scene.add(fixture);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.166,.019,12,48),new THREE.MeshBasicMaterial({color:'#FFF3E8',transparent:true,opacity:0,depthWrite:false}));
  ring.rotation.x=Math.PI/2;ring.position.set(x,top-.11,fixtureZ);scene.add(ring);
  // Every optical component shares the emitting ring's exact world-space centre.
  const origin=ring.position.clone(),end=new THREE.Vector3(x,-1.95,fixtureZ);
  const beam=makeSoftBeam(origin,end);
  const flare=new THREE.Sprite(new THREE.SpriteMaterial({map:softMap,color:'#FFF7F0',transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
  flare.position.copy(origin);flare.scale.set(.94,.94,1);scene.add(flare);
  const spot=new THREE.SpotLight('#FFF9EF',0,10.5,.62,.72,1.05);
  spot.position.copy(origin);spot.target.position.copy(end);
  // Stable shadow topology: fading a light must never disable its cast shadow.
  spot.visible=!compactView();spot.castShadow=true;spot.shadow.mapSize.set(512,512);spot.shadow.bias=-.00012;spot.shadow.normalBias=.018;
  spot.shadow.autoUpdate=false;spot.shadow.needsUpdate=true;
  scene.add(spot.target);scene.add(spot);
  const particles=makeLightParticles(origin,origin.y-end.y,index);
  exhibitSpots.set(p.id,{spot,ring,beam,flare,particles,amount:0});
 }
 buildLightRelay();
}


function makeScene(){scene=new THREE.Scene();scene.fog=new THREE.FogExp2('#060A14',.016);const rect=sceneHost.getBoundingClientRect();camera=new THREE.PerspectiveCamera(42,Math.max(rect.width,1)/Math.max(rect.height,1),.05,120);camera.position.set(startLook.x,startLook.y,startLook.z);camera.lookAt(0,-.08,0);cameraTarget=new THREE.Vector3(0,-.08,0);renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:compactView()?'low-power':'high-performance',precision:'highp'});renderer.setClearAlpha(0);renderer.setSize(rect.width,rect.height,false);renderer.setPixelRatio(Math.min(devicePixelRatio,compactView()?1.25:GALLERY_PIXEL_RATIO));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;renderer.shadowMap.enabled=!compactView();renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.useLegacyLights=false;sceneHost.appendChild(renderer.domElement);renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();closeProject();showFallback('Graphics context lost');});
 focusRenderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:compactView()?'low-power':'high-performance',precision:'highp'});
 focusRenderer.setClearColor(0x000000,0);focusRenderer.setSize(rect.width,rect.height,false);
 focusRenderer.setPixelRatio(Math.min(devicePixelRatio,compactView()?1.25:FOCUS_PIXEL_RATIO));
 focusRenderer.outputColorSpace=THREE.SRGBColorSpace;focusRenderer.toneMapping=THREE.ACESFilmicToneMapping;focusRenderer.toneMappingExposure=1.08;
 focusRenderer.shadowMap.enabled=innerWidth>760;focusRenderer.shadowMap.type=THREE.PCFSoftShadowMap;
 focusHost.appendChild(focusRenderer.domElement);

 ambientLight=new THREE.HemisphereLight('#E6E6F2','#101624',1.18);scene.add(ambientLight);
 lightKey=new THREE.DirectionalLight('#EEF0FF',1.05);lightKey.position.set(-3.1,5.25,8.4);lightKey.castShadow=true;lightKey.shadow.mapSize.set(1024,1024);lightKey.shadow.camera.left=-10;lightKey.shadow.camera.right=10;lightKey.shadow.camera.top=8;lightKey.shadow.camera.bottom=-8;lightKey.shadow.bias=-0.00035;lightKey.shadow.radius=5;scene.add(lightKey);
 lightAccent=new THREE.PointLight('#D0BCFF',10,10,2);lightAccent.position.set(-1,1.6,2.8);scene.add(lightAccent);
 const fill=new THREE.PointLight('#00F0FF',1.15,8,2.2);fill.position.set(5,-.3,3);scene.add(fill);
 const warmFill=new THREE.PointLight('#F5CF9D',0.95,7,2.2);warmFill.position.set(-4.6,-.55,2.2);scene.add(warmFill);
 accentTarget=new THREE.Color('#D0BCFF');accentCurrent=accentTarget.clone();scene.environment=buildReflectionEnvironment();scene.environmentIntensity=.18;buildArchitecture();
 glowSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:makeGlowTexture(),color:'#D0BCFF',transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));glowSprite.scale.set(4.6,3.6,1);glowSprite.position.set(0,.4,-1.65);
 PROJECTS.forEach(p=>{const d=deviceFactory(p);scene.add(d.group);displayItems.set(p.id,d);makeArtworkOverlay(p)});buildShowroomSpots();scene.traverse(o=>{if(o.isLight)o.layers.enable(ACTIVE_LAYER)});
 raycaster=new THREE.Raycaster();pointer=new THREE.Vector2(10,10);sceneReady=true;initialTime=performance.now();labels();resizeScene();render(initialTime);
}
function labels(){PROJECTS.forEach((p,i)=>{const b=document.createElement('button');b.className='device-label';b.type='button';b.dataset.id=p.id;b.innerHTML=`<strong>${p.shortName}</strong><small>${p.categoryLabel.toUpperCase()}</small>`;b.style.opacity='0';b.style.left='-300px';b.addEventListener('click',()=>chooseProject(p.id));b.addEventListener('pointerenter',()=>{keyboardHovered=null;setHovered(p.id);});b.addEventListener('pointerleave',()=>setHovered(null));b.addEventListener('focus',()=>setHovered(p.id,'keyboard'));b.addEventListener('blur',()=>setHovered(null,'keyboard'));labelsEl.append(b)})}
function setHovered(id,source='pointer'){
 if(source==='keyboard')keyboardHovered=id;else pointerHovered=id;
 if(state!=='gallery')return;
 const next=keyboardHovered||pointerHovered;
 if(hovered===next)return;
 hovered=next;setAccent(PROJECTS.find(p=>p.id===next)?.accent||'#D0BCFF');frame.classList.toggle('has-hover',Boolean(next));
}
// DOM image proxy draws the genuine artwork on top of the 3D screen. Unlike drawing
// cross-origin images into a canvas, normal <img> does not require CORS permission.
// WebGL screen stays bright as a fallback if remote assets are blocked altogether.
const screenOverlays=new Map();
function makeArtworkOverlay(p){
 const node=document.createElement('div');node.className='screen-artwork';
 const wash=document.createElement('div');wash.className='screen-artwork-wash';
 const picture=document.createElement('img');picture.alt='';picture.decoding='async';picture.loading='eager';
 node.append(wash,picture);
 let at=0;const urls=assetFallbacks(p.cover);
 const tryNext=()=>{if(at<urls.length){const src=urls[at++];picture.src=src;wash.style.backgroundImage=`url("${src}")`}else node.classList.add('not-loaded')};
 picture.addEventListener('load',()=>node.classList.add('is-loaded'));
 picture.addEventListener('error',tryNext);tryNext();
 screenHost.append(node);screenOverlays.set(p.id,node);
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
function positionArtworkOverlays(){
 const vw=sceneHost.clientWidth,vh=sceneHost.clientHeight;
 for(const p of PROJECTS){
  const d=displayItems.get(p.id),node=screenOverlays.get(p.id);
  if(!node||!d?.group.visible||!sceneReady)continue;
  const w=d.screenDimensions.w*.5,h=d.screenDimensions.h*.5;
  // Match the physical screen radius in both axes, before perspective projection.
  const radius=screenRadius(w*2,h*2,p),rx=radius/(w*2)*100,ry=radius/(h*2)*100;
  node.style.borderRadius=`${rx}% / ${ry}%`;
  node.style.clipPath=`inset(0 round ${rx}% / ${ry}%)`;
  const corners=[[-w,h],[w,h],[w,-h],[-w,-h]];
  const target=corners.map(([x,y])=>{
   const v=d.screen.localToWorld(new THREE.Vector3(x,y,0)).project(camera);
   return [(v.x*.5+.5)*vw,(-v.y*.5+.5)*vh];
  });
  const co=solveHomography([[[0,0],target[0]],[[512,0],target[1]],[[512,512],target[2]],[[0,512],target[3]]]);
  if(!co)continue;
  const [a,b,c,d1,e,f,g,h1]=co;
  // Matrix4 CSS is column-major; projective terms live in row 4.
  node.style.transform=`matrix3d(${a},${d1},0,${g},${b},${e},0,${h1},0,0,1,0,${c},${f},0,1)`;
  const focused=(activeLayerOn&&selected?.id===p.id);
  if(focused){if(node.parentElement!==focusScreenHost)focusScreenHost.append(node)}
  else if(node.parentElement!==screenHost)screenHost.append(node);
  // Background artwork remains on the same blurred layer as its device throughout focus.
  node.style.visibility=p.id==='jbl'?'hidden':'visible';
 }
}
function projectScreenProjection(d){const pos=d.screen.getWorldPosition(new THREE.Vector3());return pos.project(camera)}
function renderLabels(now){for(const p of PROJECTS){const d=displayItems.get(p.id),v=d.group.localToWorld(new THREE.Vector3(0,-1.55,0));v.project(camera);const b=labelsEl.querySelector(`[data-id="${p.id}"]`);const x=(v.x*.5+.5)*frame.clientWidth,y=(-v.y*.5+.5)*frame.clientHeight;b.style.left=`${x}px`;b.style.top=`${Math.min(frame.clientHeight-100,Math.max(105,y))}px`;b.style.opacity=String(Math.min(1,(now-initialTime-550)/450));}}
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
 startLook.z=compactView()?Math.max(10.45,5/(Math.tan(camera.fov*Math.PI/360)*camera.aspect)+.7):10.45;
 camera.updateProjectionMatrix();if(state==='gallery')camera.position.z=startLook.z;
 const galleryChanged=fitRenderer(renderer,w,h,Math.min(devicePixelRatio,compactView()?1.25:GALLERY_PIXEL_RATIO));
 const focusChanged=focusRenderer&&fitRenderer(focusRenderer,w,h,Math.min(devicePixelRatio,compactView()?1.25:FOCUS_PIXEL_RATIO));
 renderer.shadowMap.enabled=!compactView();if(focusRenderer)focusRenderer.shadowMap.enabled=!compactView()&&innerWidth>760;
 if(state==='focus'&&selected){const layout=focusLayout(selected);displayItems.get(selected.id).group.position.copy(layout.position);focusScale=layout.scale;}
 // A real buffer resize is drawn in this same frame, even on the phone's 30fps path.
 if(galleryChanged||focusChanged)lastRendered=-Infinity;
}
function focusLayout(p){
 const position=new THREE.Vector3(...p.camera.focusPosition);
 let scale=p.camera.scale;
 if(compactView()){
  const h=frame.clientHeight,availableHeight=h-inspector.offsetHeight-90;
  const depth=p.camera.position[2]-position.z;
  const unitPerPixel=2*Math.tan(camera.fov*Math.PI/360)*depth/h;
  const bounds={phone:[1.15,2.5],monitor:[2.8,2.55],tablet:[2.4,1.8],poster:[1.75,2.3]}[p.device];
  scale=Math.min(scale,(frame.clientWidth-36)*unitPerPixel/bounds[0],availableHeight*unitPerPixel/bounds[1]);
  const centerY=24+availableHeight/2;
  position.x=0;position.y=p.camera.position[1]+(cameraTarget.y-p.camera.position[1])*depth/p.camera.position[2]+(h/2-centerY)*unitPerPixel;
 }
 return {position,scale};
}
function easing(t){return 1-Math.pow(1-t,3)}
function runTween(item,targetPos,targetQuat,targetScale,targetCamera,duration,done){if(movingTween){movingTween=null;}const d=displayItems.get(item),fromCam=camera.position.clone();movingTween={id:item,fromPos:d.group.position.clone(),fromQuat:d.group.quaternion.clone(),fromScale:d.group.scale.x,fromCam,toPos:targetPos.clone(),toQuat:targetQuat.clone(),toScale:targetScale,toCam:targetCamera.clone(),start:performance.now(),duration:motionReduced()?0:duration,done};if(motionReduced())tickTween(performance.now())}
function tickTween(now){if(!movingTween)return;const t=movingTween.duration?Math.min(1,(now-movingTween.start)/movingTween.duration):1,e=easing(Math.max(0,t));const d=displayItems.get(movingTween.id);d.group.position.lerpVectors(movingTween.fromPos,movingTween.toPos,e);d.group.quaternion.copy(movingTween.fromQuat).slerp(movingTween.toQuat,e);d.group.scale.setScalar(movingTween.fromScale+(movingTween.toScale-movingTween.fromScale)*e);camera.position.lerpVectors(movingTween.fromCam,movingTween.toCam,e);camera.lookAt(cameraTarget);if(t>=1){const done=movingTween.done;movingTween=null;done?.();}}
function setForeground(id,enabled){
 const d=displayItems.get(id);if(!d)return;
 d.group.traverse(obj=>{if(obj.isMesh)obj.layers.set(enabled?ACTIVE_LAYER:0)});
 activeLayerOn=enabled;focusHost.classList.toggle('is-active',enabled);
}
function setPanel(p){$('#inspector-index').textContent=`EXHIBIT ${String(PROJECTS.indexOf(p)+1).padStart(2,'0')} / 04`;$('#inspector-kicker').textContent=p.categoryLabel.toUpperCase();$('#inspector-title').textContent=p.name;$('#inspector-year').textContent=p.year;$('#inspector-description').textContent=p.description;$('#inspector-open').href=p.id==='jbl'?'https://github.com/GiorgiGiorgadze18/MeeTab1.1':assetUrl(p.cover);$('#inspector-open').textContent=p.id==='jbl'?'MEETAB PROJECT ↗':'VIEW ORIGINAL ARTWORK ↗';}
function revealShowroom(){
 const rect=frame.getBoundingClientRect();
 if(rect.top>=($('#navbar')?.offsetHeight||0)&&rect.bottom<=innerHeight)return;
 const root=document.documentElement,previous=root.style.scrollBehavior;
 root.style.scrollBehavior='auto';frame.scrollIntoView({behavior:'auto',block:'center'});root.style.scrollBehavior=previous;
}
function openPanel(){if(compactView())resizeScene();frame.classList.add('is-focused');$('#inspector-backdrop').classList.add('is-open');inspector.classList.add('is-open');inspector.setAttribute('aria-hidden','false');inspector.inert=false;resetButton.hidden=false;requestAnimationFrame(()=>{closeButton.focus({preventScroll:true});revealShowroom();});const tryButton=$('#try-preview');tryButton.hidden=selected?.id!=='jbl';tryButton.disabled=selected?.id==='jbl'&&!meeTabReady;tryButton.textContent=tryButton.disabled?'Loading demo…':previewActive?'Exit preview':'Try now ↗';sendPreviewMode();}
function closePanel(){environmentZoomTarget=1;previewActive=false;demoBlend=0;syncDemoWorkspace();$('#try-preview').hidden=true;frame.classList.remove('is-focused');$('#inspector-backdrop').classList.remove('is-open');inspector.classList.remove('is-open');inspector.setAttribute('aria-hidden','true');inspector.inert=true;resetButton.hidden=true;sendPreviewMode();}
function chooseProject(id){environmentZoom=environmentZoomTarget=1;if(camera){camera.zoom=1;camera.updateProjectionMatrix();}const p=ARCHIVE_PROJECTS.find(x=>x.id===id);if(!p)return;if(p===JBL_ARTWORK){openAccessibleDetail(p);return}if(!sceneReady){openAccessibleDetail(p);return}if(p.id==='jbl')ensureMeeTabPortal();revealShowroom();if(state==='focus'&&selected?.id===id){closeProject();return}if(state!=='gallery'){queuedSelection=id;closeProject();return}hovered=keyboardHovered=pointerHovered=null;pointerInGallery=false;frame.classList.remove('has-hover');selected=p;state='opening';setForeground(id,true);frame.classList.add('is-focused');setPanel(p);setAccent(p.accent);labelsEl.classList.add('is-hidden');labelsEl.inert=true;$('#stage-caption').textContent=`${p.shortName} · DRAG TO ROTATE ±15°`;lightAccent.position.set(...p.scene.position).add(new THREE.Vector3(0,.72,2.95));const d=displayItems.get(id);const focusEuler=p.device==='phone'?new THREE.Euler(-.06,.14,.015):p.device==='monitor'?new THREE.Euler(-.02,-.08,0):p.device==='tablet'?new THREE.Euler(-.07,-.10,.02):new THREE.Euler(-.03,-.11,0);const quat=new THREE.Quaternion().setFromEuler(focusEuler);focusTilt.x=focusTilt.y=0;focusTiltTarget.x=focusTiltTarget.y=0;const layout=focusLayout(p);focusScale=layout.scale;runTween(id,layout.position,quat,focusScale,new THREE.Vector3(...p.camera.position),900,()=>{state='focus';selectedBaseQuaternion=quat.clone();openPanel()})}
function closeProject(){if(state==='gallery'||state==='closing')return;const p=selected;if(!p)return;closePanel();state='closing';setAccent('#D0BCFF');const d=displayItems.get(p.id);focusTilt.x=focusTilt.y=0;focusTiltTarget.x=focusTiltTarget.y=0;runTween(p.id,d.homePosition,d.homeQuaternion,d.homeScale,new THREE.Vector3(startLook.x,startLook.y,startLook.z),750,()=>{setForeground(p.id,false);state='gallery';selected=null;selectedBaseQuaternion=null;const returnControl=document.querySelector(`[data-explore="${p.id}"]`);if(frame.contains(document.activeElement))returnControl?.focus({preventScroll:true});labelsEl.classList.remove('is-hidden');labelsEl.inert=false;$('#stage-caption').textContent='CURATED EXPERIENCES';if(queuedSelection){const next=queuedSelection;queuedSelection=null;chooseProject(next)}})}
let persistentMeeTabFrame=null,meeTabReady=false;
function ensureMeeTabPortal(){
 const portal=$('#screen-portal');
 if(persistentMeeTabFrame)return persistentMeeTabFrame;
 const iframe=document.createElement('iframe');iframe.title='MeeTab interactive preview';iframe.width='1280';iframe.height='800';iframe.setAttribute('sandbox','allow-scripts');iframe.referrerPolicy='no-referrer';
 persistentMeeTabFrame=iframe;
 const signal=$('#demo-signal');
 if(signal){
  signal.setAttribute('viewBox','0 0 1280 800');signal.setAttribute('preserveAspectRatio','none');
  if(!signal.querySelector('rect')){const outline=document.createElementNS('http://www.w3.org/2000/svg','rect');for(const [key,value] of Object.entries({fill:'none',x:8,y:8,width:1264,height:784,rx:48,pathLength:1,'vector-effect':'non-scaling-stroke'}))outline.setAttribute(key,String(value));signal.replaceChildren(outline);}
 }
 portal.replaceChildren(iframe);if(signal)portal.append(signal);
 iframe.src=new URL("./meetab-demo.html",import.meta.url).href;portal.hidden=false;
 return iframe;
}
function sendPreviewMode(){if(!meeTabReady)return;persistentMeeTabFrame?.contentWindow?.postMessage({showroom:true,kind:'interactive',enabled:previewActive&&state==='focus'&&selected?.id==='jbl'},'*');}

let demoBlend=0;
function syncDemoWorkspace(){
 frame.classList.toggle('is-demo',previewActive);
 const workspace=$('.demo-workspace');workspace.inert=!previewActive;
 $('#try-preview').setAttribute('aria-pressed',String(previewActive));
 const interactive=previewActive&&state==='focus'&&selected?.id==='jbl';
 $('#screen-portal').inert=!interactive;$('#screen-portal').style.pointerEvents=interactive?'auto':'none';
 $('.interaction-hint').innerHTML=previewActive?'<span class="hint-dot"></span> INTERACTIVE MODE · MEETAB':'<span class="hint-dot"></span> SELECT A DEVICE TO EXPLORE';
 $('#demo-announcement').textContent=previewActive?'Demo active. MeeTab is ready to use.':'Preview ended. Your progress is saved.';
 if(!previewActive&&workspace.contains(document.activeElement))$('#try-preview').focus({preventScroll:true});
}

function activateInteractiveScreen(p){
 if(p.id!=='jbl'||state!=='focus')return;
 ensureMeeTabPortal();previewActive=!previewActive;
 $('#try-preview').textContent=previewActive?'Exit preview':'Try now ↗';
 syncDemoWorkspace();sendPreviewMode();
}
function zoomEnvironment(delta,mode=0){
 if(state!=='focus'||!Number.isFinite(delta))return;
 const units=delta*(mode===1?16:mode===2?frame.clientHeight:1);
 environmentZoomTarget=clamp(environmentZoomTarget*Math.exp(-clamp(units,-160,160)*.0018),.75,1.65);
}
window.addEventListener('wheel',event=>{
 if(state!=='focus'||event.ctrlKey||!frame.contains(event.target)||inspector.contains(event.target))return;
 event.preventDefault();event.stopPropagation();zoomEnvironment(event.deltaY,event.deltaMode);
},{capture:true,passive:false});
window.addEventListener('message',event=>{
 if(!persistentMeeTabFrame||event.source!==persistentMeeTabFrame.contentWindow||event.data?.showroom!==true)return;
 const msg=event.data;
 if(msg.kind==='ready'){meeTabReady=true;const button=$('#try-preview');button.disabled=false;button.textContent=previewActive?'Exit preview':'Try now ↗';sendPreviewMode();}
 if(msg.kind==='wheel')zoomEnvironment(msg.delta,msg.mode);
 if(msg.kind==='drag'&&state==='focus'&&selected?.id==='jbl'){
  if(!Number.isFinite(msg.dx)||!Number.isFinite(msg.dy))return;
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
 const portal=$('#screen-portal'),d=displayItems.get('jbl');if(!d)return;
 const w=d.screenDimensions.w/2,h=d.screenDimensions.h/2,width=1280,height=800,vw=frame.clientWidth,vh=frame.clientHeight;
 const points=[[-w,h],[w,h],[w,-h],[-w,-h]].map(([x,y])=>{const v=d.screen.localToWorld(new THREE.Vector3(x,y,0)).project(camera);return[(v.x*.5+.5)*vw,(-v.y*.5+.5)*vh];});
 const co=solveHomography([[[0,0],points[0]],[[width,0],points[1]],[[width,height],points[2]],[[0,height],points[3]]]);if(!co)return;
 const[a,b,c,d1,e,f,g,h1]=co;let transform=`matrix3d(${a},${d1},0,${g},${b},${e},0,${h1},0,0,1,0,${c},${f},0,1)`;
 const r=screenRadius(w*2,h*2,d.project);setScreenStyle(portal,'borderRadius',`${r/(w*2)*100}% / ${r/(h*2)*100}%`);
 const inFocus=state==='focus'&&selected?.id==='jbl';
 if(compactView()&&inFocus&&previewActive){
  // An affine screen avoids perspective iframe hit-testing differences on touch browsers.
  const available=vh-inspector.offsetHeight-90,depth=selected.camera.position[2]-selected.camera.focusPosition[2];
  const unitPerPixel=2*Math.tan(camera.fov*Math.PI/360)*depth/vh;
  const scale=Math.min(vw-44,d.screenDimensions.w*focusScale*1.09/unitPerPixel)/width;
  const x=(vw-width*scale)/2,centerY=vh/2+(24+available/2-vh/2)*1.055,y=centerY-height*scale/2;
  transform=`translate(${x}px,${y}px) scale(${scale})`;
 }

 setScreenStyle(portal,'width',width+'px');setScreenStyle(portal,'height',height+'px');setScreenStyle(portal,'transform',transform);
 setScreenStyle(portal,'pointerEvents',inFocus&&previewActive?'auto':'none');
 const inert=!(inFocus&&previewActive);if(portal.inert!==inert)portal.inert=inert;
 const background=state!=='gallery'&&selected?.id!=='jbl';setScreenStyle(portal,'filter',background?'blur(5px) brightness(.42) saturate(.72)':'none');
 setScreenStyle(portal,'zIndex',state!=='gallery'&&selected?.id==='jbl'?'9':'3');
 const button=$('#try-preview');button.hidden=!inFocus;
 // Keep the control still while the camera and tablet interpolate.
 const controlX=compactView()?vw*.75:clamp((vw-inspector.offsetWidth)/2,90,vw-inspector.offsetWidth-90),controlY=compactView()?vh-inspector.offsetHeight-56:Math.max(82,vh-110);
 if(inFocus){button.style.left=controlX+'px';button.style.top=controlY+'px';}
}

function clientPointer(event){const r=renderer.domElement.getBoundingClientRect();pointer.x=((event.clientX-r.left)/r.width)*2-1;pointer.y=-((event.clientY-r.top)/r.height)*2+1;lastPointer.x=pointer.x;lastPointer.y=pointer.y;}
function identifyUnderPointer(){raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(meshes,false);return hits.length?hits[0].object.userData.projectId:null}
function setupInteraction(){
 $('.demo-exit').addEventListener('click',()=>{if(previewActive&&selected)activateInteractiveScreen(selected);});
 $('#try-preview').addEventListener('click',()=>{if(state==='focus'&&selected)activateInteractiveScreen(selected);});
 const canvas=renderer.domElement,front=focusRenderer.domElement;
 canvas.addEventListener('pointermove',event=>{
  clientPointer(event);pointerInGallery=event.pointerType!=='touch';keyboardHovered=null;
  if(state!=='gallery')return;
  const id=identifyUnderPointer();canvas.style.cursor=id?'pointer':'default';setHovered(id);
 });
 canvas.addEventListener('pointerleave',()=>{pointerInGallery=false;lastPointer.x=lastPointer.y=0;setHovered(null);});
 canvas.addEventListener('pointercancel',()=>{pointerInGallery=false;setHovered(null);});
 let galleryPress=null;
 canvas.addEventListener('pointerdown',event=>{if(state!=='gallery')return;clientPointer(event);galleryPress={id:identifyUnderPointer(),x:event.clientX,y:event.clientY};});
 canvas.addEventListener('pointerup',event=>{if(state==='gallery'&&galleryPress?.id&&Math.hypot(event.clientX-galleryPress.x,event.clientY-galleryPress.y)<12)chooseProject(galleryPress.id);galleryPress=null;});
 canvas.addEventListener('pointercancel',()=>{galleryPress=null;});
 const touches=new Map();let pinchDistance=0;
 front.addEventListener('pointerdown',event=>{
  if(state!=='focus'||!selected)return;
  if(event.pointerType==='touch'){touches.set(event.pointerId,{x:event.clientX,y:event.clientY});if(touches.size===2){const [a,b]=[...touches.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);front.setPointerCapture(event.pointerId);event.preventDefault();return;}}
  clientPointer(event);
  // Only actual device pixels begin a drag; blank space dismisses.
  raycaster.layers.set(ACTIVE_LAYER);raycaster.setFromCamera(pointer,camera);
  const d=displayItems.get(selected.id);
  const hit=raycaster.intersectObjects(meshes.filter(m=>m.userData.projectId===selected.id),false).length>0;
  raycaster.layers.set(0);
  if(!hit&&!previewActive){closeProject();return;}
  event.stopPropagation();event.preventDefault();dragOrbit=true;
  pointerDownPos={x:event.clientX,y:event.clientY};front.setPointerCapture(event.pointerId);
  front.style.cursor='grabbing';
 });
 front.addEventListener('pointermove',event=>{
  if(state!=='focus'||!selected)return;
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

function render(time){
 if(!sceneReady)return;
 requestAnimationFrame(render);
 if(resizePending){resizePending=false;resizeScene();}
 if(document.hidden||(!stageVisible&&!movingTween)){lastFrame=time;return;}
 if(compactView()&&time-lastRendered<1000/30)return;lastRendered=time;
 const delta=Math.min(.055,(time-lastFrame)/1000||.016),speed=Math.min(1,delta*(motionReduced()?30:7.5));
 lastFrame=time;tickTween(time);
 accentCurrent.lerp(accentTarget,1-Math.exp(-delta*2.4));
 lightAccent.color.copy(accentCurrent);if(glowSprite)glowSprite.material.color.copy(accentCurrent);
 accentReactiveMaterials.forEach(m=>m.color.copy(accentCurrent));
 const activeId=modal?.open?null:(state==='gallery'?hovered:(state==='closing'?null:selected?.id));
 updateLightRelay(activeId,delta);
 const targetAmbient=state==='focus'?0.92:(activeId?1.02:0.90);
 const targetKey=state==='focus'?0.98:(activeId?1.18:0.94);
 ambientLight.intensity = damp(ambientLight.intensity,targetAmbient,Math.min(1,delta*4.0),Math.min(1,delta*1.25));
 lightKey.intensity = damp(lightKey.intensity,targetKey,Math.min(1,delta*4.0),Math.min(1,delta*1.25));
 scene.environmentIntensity = damp(scene.environmentIntensity,((activeId||state==='focus')?0.18:0.11),Math.min(1,delta*3.4),Math.min(1,delta*1.05));
 for(const p of PROJECTS){
  const d=displayItems.get(p.id),targetHover=state==='gallery'&&hovered===p.id?1:0;
  const targetDim=activeId&&activeId!==p.id?1:0;
  d.hoverAmount = motionReduced()?0:damp(d.hoverAmount,targetHover,1-Math.exp(-delta*6),1-Math.exp(-delta*2.2));
  d.lightAmount=damp(d.lightAmount,activeId===p.id?1:0,1-Math.exp(-delta*(motionReduced()?28:6.0)),1-Math.exp(-delta*(motionReduced()?28:2.2)));
  if(d.lightAmount<.0001&&activeId!==p.id)d.lightAmount=0;
  d.dimAmount = damp(d.dimAmount,targetDim,Math.min(1,delta*6.2),Math.min(1,delta*1.85));
  const isFocus=selected?.id===p.id && state!=='gallery';
  const bodyBrightness=isFocus?1.12:(.80+.28*d.lightAmount-.30*d.dimAmount);
  const screenBloomStrength=isFocus?1.0:(.18+.54*d.lightAmount);
  d.group.traverse(o=>{
   if(!o.isMesh||!o.material?.userData.baseColor)return;
   if(o.userData.isScreen){
    const targetScreen=isFocus?1.04:(.84+.11*d.lightAmount);
    o.material.color.setScalar(targetScreen);
    return;
   }
   o.material.color.copy(o.material.userData.baseColor).multiplyScalar(bodyBrightness);
  });
  if(d.screenBloom){const targetBloom=0.04 + screenBloomStrength*.28;d.screenBloom.material.opacity=damp(d.screenBloom.material.opacity,targetBloom,Math.min(1,delta*7.0),Math.min(1,delta*3.2));}
  if(d.screenLight){
    const targetLight=isFocus?(p.device==='monitor'?3.9:3.0):(.18+d.lightAmount*(p.device==='monitor'?2.32:1.72));
    d.screenLight.intensity = damp(d.screenLight.intensity,targetLight,Math.min(1,delta*7.0),Math.min(1,delta*3.2));
  }
  const overlay=screenOverlays.get(p.id);
  if(overlay){
    overlay.style.setProperty('--screen-brightness', String(isFocus?1.06:(.82+.16*d.lightAmount)));
    overlay.style.setProperty('--screen-glow', String(isFocus?1:(.10+.52*d.lightAmount)));
    overlay.style.setProperty('--screen-wash-opacity', String(isFocus?.22:(.06+.10*d.lightAmount)));
  }
  const rig=exhibitSpots.get(p.id);
  if(rig){
   const amount=rig.amount=d.lightAmount;
   rig.spot.intensity=amount*(p.device==='monitor'?110:96);
   rig.spot.shadow.needsUpdate=amount>0;
   rig.ring.material.opacity=amount;
   rig.beam.material.uniforms.uOpacity.value=amount*.48;
   rig.flare.material.opacity=amount*.72;
   alignSoftBeam(rig.beam);
   rig.particles.visible=!compactView()&&!motionReduced()&&amount>.001;
   rig.particles.material.uniforms.uTime.value=(time-initialTime)/1000;
   rig.particles.material.uniforms.uOpacity.value=amount*.52;
   rig.particles.material.uniforms.uPixelRatio.value=renderer.getPixelRatio();
  }
 }
 const now=time-initialTime;
 if(state==='gallery'&&!movingTween){
  const px=motionReduced()?0:lastPointer.x*.08,py=motionReduced()?0:lastPointer.y*.05;
  camera.position.x+=(px-camera.position.x)*Math.min(1,delta*1.8);
  camera.position.y+=((startLook.y+py)-camera.position.y)*Math.min(1,delta*1.8);
  camera.lookAt(cameraTarget);
  PROJECTS.forEach((p,i)=>{
   const d=displayItems.get(p.id),reveal=motionReduced()?1:Math.max(0,Math.min(1,(now-120-i*130)/650));
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
   d.group.position.y=d.homePosition.y-.16*(1-r)+(motionReduced()?0:Math.sin(time*.00042+i)*.012)+d.hoverAmount*.095+d.magnet.y*.045;
   d.group.position.z=d.homePosition.z+d.hoverAmount*.37;
   d.group.quaternion.copy(d.homeQuaternion);
   if(d.hoverAmount>.001)d.group.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-d.magnet.y*.045,(-.055+d.magnet.x*.085)*d.hoverAmount,0)));
  });
 }
 if(state==='focus'&&selected){
  if(!movingTween&&selectedBaseQuaternion){
   const d=displayItems.get(selected.id);
   focusTilt.x+=(focusTiltTarget.x-focusTilt.x)*Math.min(1,delta*5.6);
   focusTilt.y+=(focusTiltTarget.y-focusTilt.y)*Math.min(1,delta*5.6);
   const qx=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),focusTilt.x);
   const qy=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),focusTilt.y);
   demoBlend=motionReduced()?(previewActive?1:0):THREE.MathUtils.lerp(demoBlend,previewActive?1:0,1-Math.exp(-delta*8));
   d.group.quaternion.copy(selectedBaseQuaternion).slerp(new THREE.Quaternion(),demoBlend*.92).multiply(qy).multiply(qx);
   d.group.scale.setScalar(focusScale*(1+.035*demoBlend));
  }
 }
// Project against the current frame, before either renderer updates world matrices.
 environmentZoom=motionReduced()?environmentZoomTarget:THREE.MathUtils.lerp(environmentZoom,environmentZoomTarget,1-Math.exp(-delta*9));
 camera.zoom=environmentZoom*(1+.055*demoBlend);camera.updateProjectionMatrix();
 scene.updateMatrixWorld(true);
 camera.updateMatrixWorld(true);
 renderLabels(time);
 positionArtworkOverlays();
 positionScreenPortal();
 if(glowSprite)glowSprite.material.opacity=0;
 camera.layers.set(0);renderer.render(scene,camera);
 if(activeLayerOn){camera.layers.set(ACTIVE_LAYER);focusRenderer.render(scene,camera);camera.layers.set(0);}
}


function installKeys(){document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state!=='gallery'){e.preventDefault();closeProject()}else if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&state==='focus'&&!modal?.open){const n=PROJECTS.length,i=PROJECTS.findIndex(p=>p.id===selected.id),j=(i+(e.key==='ArrowRight'?1:-1)+n)%n;queuedSelection=PROJECTS[j].id;closeProject()}});closeButton.addEventListener('click',closeProject);
 // Dismiss even when the user clicks outside the showroom frame (page header/archive).
 document.addEventListener('pointerdown',event=>{
  if(state!=='focus'||previewActive||!inspector.classList.contains('is-open'))return;
  if(inspector.contains(event.target)||event.target.closest('#screen-portal')||focusHost.contains(event.target)||event.target.closest('.stage-actions,#try-preview'))return;
  closeProject();
 });
 resetButton.addEventListener('click',closeProject);}
function showFallback(detail){stageLoading.classList.add('is-done');fallbackEl.hidden=false;labelsEl.hidden=true;if(detail)console.warn('[showroom] fallback:',detail);sceneReady=false;}
async function initialize(){try{const c=document.createElement('canvas');if(!(c.getContext('webgl2')||c.getContext('webgl'))){showFallback('WebGL not available');return}
 // No framework migration: dynamically load Three.js only on devices capable of the 3D showroom.
 await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('./vendor/three.js',import.meta.url).href;script.onload=resolve;script.onerror=()=>reject(new Error('Local Three.js engine did not load'));document.head.append(script)});THREE=window.SHOWROOM_THREE;if(!THREE)throw new Error('Local Three.js engine did not load');makeScene();frame.appendChild($('#try-preview'));if(!compactView())ensureMeeTabPortal();setupInteraction();stageLoading.classList.add('is-done');window.addEventListener('resize',queueSceneResize,{passive:true});const ro=new ResizeObserver(queueSceneResize);ro.observe(frame);const visibility=new IntersectionObserver(entries=>{stageVisible=entries[entries.length-1].isIntersecting},{rootMargin:'150px'});visibility.observe(frame);
 }catch(error){console.error('[showroom] 3D initialization failed',error);showFallback(error.message)}}
setMenu();buildArchive();installKeys();initialize();

