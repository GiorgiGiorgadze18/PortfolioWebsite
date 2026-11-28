import {stackLayer} from './stack-motion.mjs';
import {resolveFrame} from './frame-style.mjs';
import {createFrameMaterial} from './frame-shader.mjs';
import {layerProgress} from './layer-progress.mjs';
// Real planes attached to the selected showroom display. No renderer or rAF owned here.
import {createTimeline} from './timeline.mjs';
export async function loadWebGLLayers({THREE,device,camera,layer,baseURL,warmTexture,signal}){
 const [manifest,config]=await Promise.all(['manifest.json','presentation.json'].map(name=>fetch(new URL(name,baseURL),{signal}).then(r=>{if(!r.ok)throw Error('Case data unavailable');return r.json();})));
 if(!manifest.validated)throw Error('Unvalidated case assets');
 const aspect=manifest.canvas[0]/manifest.canvas[1],h=Math.min(device.screenDimensions.h,device.screenDimensions.w/aspect),w=h*aspect;
 const root=new THREE.Group();root.visible=false;root.layers.set(layer);const geometry=new THREE.PlaneGeometry(w,h),planes=[],textures=[];let originalPlane=null;
 let frameKit,frameGeometry;const overlays=[];
 const loader=new THREE.TextureLoader();
 async function prepareTexture(src){
  signal?.throwIfAborted();
  const texture=await loader.loadAsync(new URL(src,baseURL).href);
  textures.push(texture);
  texture.colorSpace=THREE.SRGBColorSpace;
  // Upload one image per paint opportunity before exposing the live scene.
  if(warmTexture){
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   signal?.throwIfAborted();
   warmTexture(texture);
  }
  signal?.throwIfAborted();
  return texture;
 }
 try{
  for(const item of manifest.layers){const texture=await prepareTexture(item.src);
   const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false,side:THREE.DoubleSide});const mesh=new THREE.Mesh(geometry,material);mesh.userData.stackMotion={};mesh.layers.set(layer);mesh.renderOrder=20+planes.length;root.add(mesh);planes.push(mesh);}
 if(manifest.original){const texture=await prepareTexture(manifest.original);originalPlane=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false}));originalPlane.layers.set(layer);originalPlane.renderOrder=19;originalPlane.position.z=.125;root.add(originalPlane);}
 }catch(error){textures.forEach(t=>t.dispose());planes.forEach(p=>p.material.dispose());geometry.dispose();frameGeometry?.dispose();frameKit?.material.dispose();throw error;}
 const style=resolveFrame(manifest,[textures[0].image,textures[manifest.layers.length-1].image]);frameKit=createFrameMaterial(THREE,style,w,h);frameGeometry=new THREE.PlaneGeometry(w+frameKit.short*.14,h+frameKit.short*.14);
 planes.forEach((plane,i)=>{const sheet=new THREE.Mesh(frameGeometry,frameKit.material);sheet.layers.set(layer);sheet.position.z=.0002;sheet.renderOrder=plane.renderOrder+.5;sheet.onBeforeRender=()=>{frameKit.material.uniforms.uDim.value=plane.userData.sheetDim??1;frameKit.material.uniforms.uBottom.value=i===0?1:0;frameKit.material.uniforms.uLayerAlphaMap.value=textures[i];frameKit.material.uniformsNeedUpdate=true;};plane.add(sheet);overlays.push(sheet);});
 const supports=[];device.group.traverse(o=>{if(o.userData.caseStudySupport){supports.push([o,o.visible]);o.visible=false;}});
 device.group.add(root);const timeline=createTimeline(config.keyframes),axis=new THREE.Vector3(-config.rotationAxis[0],config.rotationAxis[1],-config.rotationAxis[2]).normalize();
 const stackMobile=matchMedia('(max-width:700px)');const originalScreenVisible=device.screen.visible;
 const entryPosition=device.group.position.clone(),entryRotation=device.group.quaternion.clone(),entryScale=device.group.scale.clone(),targetRotation=new THREE.Quaternion();
 const stageBounds=document.querySelector('#focus-canvas').getBoundingClientRect();
 const projectedEntry=entryPosition.clone().project(camera);
 const entryScreen={x:stageBounds.left+(projectedEntry.x*.5+.5)*stageBounds.width,y:stageBounds.top+(-projectedEntry.y*.5+.5)*stageBounds.height};
 let entryAligned=false;
 const entryView={x:camera.view?.enabled?camera.view.offsetX/camera.view.fullWidth:0,y:camera.view?.enabled?camera.view.offsetY/camera.view.fullHeight:0};
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let entryStarted=null,entrySettled=false,current=null,dirty=true;
 function draw(p,rect){
  current={p,rect};dirty=true;root.visible=true;
  const now=performance.now();entryStarted??=now;
  const elapsed=reducedMotion.matches?1:Math.min(1,(now-entryStarted)/650);
  const blend=elapsed*elapsed*(3-2*elapsed);entrySettled=elapsed===1;
  const state=timeline.stateAt(p),width=innerWidth,height=innerHeight;
  camera.setViewOffset(width,height,THREE.MathUtils.lerp(entryView.x*width,width/2-(rect.x+rect.width/2),blend),THREE.MathUtils.lerp(entryView.y*height,height/2-(rect.y+rect.height/2),blend),width,height);camera.updateProjectionMatrix();
  if(!entryAligned){
   entryPosition.set(entryScreen.x/width*2-1,1-entryScreen.y/height*2,projectedEntry.z).unproject(camera);
   entryScale.multiplyScalar(stageBounds.height/height);
   entryAligned=true;
  }
  frameKit.update(state.spread);const unit=w/350;
  const tilt=new THREE.Quaternion().setFromAxisAngle(axis,state.tilt*Math.PI/180);targetRotation.copy(entryRotation).slerp(camera.quaternion,Math.min(1,p/.18)).multiply(tilt);
  const center=new THREE.Vector3(0,0,device.project.camera.focusZ),depth=-camera.worldToLocal(center.clone()).z;
  const unitsPerPixel=2*Math.tan(camera.fov*Math.PI/360)*depth/(height*camera.zoom);
  const scale=Math.min(rect.width*.6*unitsPerPixel/device.bodyDimensions.w,rect.height*.65*unitsPerPixel/device.bodyDimensions.h,1.5);
  device.group.scale.setScalar(scale*(config.stackOrder?.78:1));
  const z=center.project(camera).z;device.group.position.set((rect.x+rect.width/2)/width*2-1,1-(rect.y+rect.height/2)/height*2,z).unproject(camera);if(config.stackOrder)device.group.position.y-=rect.height*.06*unitsPerPixel;
  device.group.position.lerpVectors(entryPosition,device.group.position,blend);device.group.quaternion.slerpQuaternions(entryRotation,targetRotation,blend);device.group.scale.lerpVectors(entryScale,device.group.scale,blend);
  planes.forEach((mesh,i)=>{const [x,y,z]=config.offsets[i],spread=layerProgress(config.layerWindows,state,p,i);const motion=stackLayer(config,state,p,i,stackMobile.matches,mesh.userData.stackMotion);mesh.userData.sheetDim=motion?.brightness??1;mesh.material.color.setScalar(Math.pow(mesh.userData.sheetDim,2.2));mesh.position.set(x*unit*spread,-y*unit*spread,.126+(motion?motion.z:z*spread)*unit+i*.0001);mesh.material.opacity=1-state.original;if(motion){mesh.renderOrder=20+mesh.position.z*1000+i*.001;overlays[i].renderOrder=mesh.renderOrder+.0001;}});
  device.screen.visible=originalPlane?false:state.original>.001;if(originalPlane)originalPlane.material.opacity=state.original;
 }
 return {seek(p,rect){current={p,rect};dirty=true;},get dirty(){return dirty;},refresh(){if(current)draw(current.p,current.rect);dirty=!entrySettled;},anchors(){return planes.map((mesh,i)=>{const b=manifest.layers[i].bbox;const point=new THREE.Vector3(((b[0]+b[2])/2/manifest.canvas[0]-.5)*w,(.5-(b[1]+b[3])/2/manifest.canvas[1])*h,0);mesh.localToWorld(point);point.project(camera);return {x:(point.x*.5+.5)*innerWidth,y:(-.5*point.y+.5)*innerHeight};});},surfaceBounds(){
  const {w:bodyWidth,h:bodyHeight}=device.bodyDimensions;
  const corners=[[-1,-1],[-1,1],[1,-1],[1,1]].map(([x,y])=>{
   const point=device.group.localToWorld(new THREE.Vector3(x*bodyWidth/2,y*bodyHeight/2,.135)).project(camera);
   return {x:(point.x*.5+.5)*innerWidth,y:(.5-point.y*.5)*innerHeight};
  });
  return {left:Math.min(...corners.map(p=>p.x)),right:Math.max(...corners.map(p=>p.x)),
   top:Math.min(...corners.map(p=>p.y)),bottom:Math.max(...corners.map(p=>p.y))};
 },inspect(){return {planes:planes.length,supportsHidden:supports.every(([object])=>!object.visible),progress:current?.p,depths:planes.map(m=>m.position.z)};},dispose(){root.removeFromParent();textures.forEach(t=>t.dispose());planes.forEach(p=>p.material.dispose());originalPlane?.material.dispose();geometry.dispose();frameGeometry?.dispose();frameKit?.material.dispose();device.screen.visible=originalScreenVisible;supports.forEach(([object,visible])=>object.visible=visible);}};
}
