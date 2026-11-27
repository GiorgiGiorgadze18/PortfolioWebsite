import {layerProgress} from './layer-progress.mjs';
// Real planes attached to the selected showroom display. No renderer or rAF owned here.
import {createTimeline} from './timeline.mjs';
export async function loadWebGLLayers({THREE,device,camera,layer,baseURL}){
 const [manifest,config]=await Promise.all(['manifest.json','presentation.json'].map(name=>fetch(new URL(name,baseURL)).then(r=>{if(!r.ok)throw Error('Case data unavailable');return r.json();})));
 if(!manifest.validated)throw Error('Unvalidated case assets');
 const aspect=manifest.canvas[0]/manifest.canvas[1],h=Math.min(device.screenDimensions.h,device.screenDimensions.w/aspect),w=h*aspect;
 const root=new THREE.Group();root.layers.set(layer);const geometry=new THREE.PlaneGeometry(w,h),planes=[],textures=[];let originalPlane=null;
 const borderGeometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-w/2,-h/2,0),new THREE.Vector3(w/2,-h/2,0),new THREE.Vector3(w/2,h/2,0),new THREE.Vector3(-w/2,h/2,0)]),borderMaterial=new THREE.LineBasicMaterial({color:0xb455cf,transparent:true,opacity:0,depthWrite:false});
 const loader=new THREE.TextureLoader();
 try{
  for(const item of manifest.layers){const texture=await loader.loadAsync(new URL(item.src,baseURL).href);textures.push(texture);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
   const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false,side:THREE.DoubleSide});const mesh=new THREE.Mesh(geometry,material);mesh.layers.set(layer);mesh.renderOrder=20+planes.length;const border=new THREE.LineLoop(borderGeometry,borderMaterial);border.layers.set(layer);border.position.z=.0002;mesh.add(border);root.add(mesh);planes.push(mesh);}
 if(manifest.original){const texture=await loader.loadAsync(new URL(manifest.original,baseURL).href);textures.push(texture);texture.colorSpace=THREE.SRGBColorSpace;originalPlane=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false}));originalPlane.layers.set(layer);originalPlane.renderOrder=19;originalPlane.position.z=.125;root.add(originalPlane);}
 }catch(error){textures.forEach(t=>t.dispose());planes.forEach(p=>p.material.dispose());geometry.dispose();borderGeometry.dispose();borderMaterial.dispose();throw error;}
 const supports=[];device.group.traverse(o=>{if(o.userData.caseStudySupport){supports.push([o,o.visible]);o.visible=false;}});
 device.group.add(root);const timeline=createTimeline(config.keyframes),axis=new THREE.Vector3(-config.rotationAxis[0],config.rotationAxis[1],-config.rotationAxis[2]).normalize();
 const originalScreenVisible=device.screen.visible;let current=null,dirty=true;
 function draw(p,rect){
  current={p,rect};dirty=true;const state=timeline.stateAt(p),width=innerWidth,height=innerHeight;
  camera.setViewOffset(width,height,width/2-(rect.x+rect.width/2),height/2-(rect.y+rect.height/2),width,height);camera.updateProjectionMatrix();
  borderMaterial.opacity=state.spread*.5;const unit=w/350;
  const tilt=new THREE.Quaternion().setFromAxisAngle(axis,state.tilt*Math.PI/180);device.group.quaternion.copy(camera.quaternion).multiply(tilt);
  const center=new THREE.Vector3(0,0,device.project.camera.focusZ),depth=-camera.worldToLocal(center.clone()).z;
  const unitsPerPixel=2*Math.tan(camera.fov*Math.PI/360)*depth/(height*camera.zoom);
  const scale=Math.min(rect.width*.6*unitsPerPixel/device.bodyDimensions.w,rect.height*.65*unitsPerPixel/device.bodyDimensions.h,1.5);
  device.group.scale.setScalar(scale);
  const z=center.project(camera).z;device.group.position.set((rect.x+rect.width/2)/width*2-1,1-(rect.y+rect.height/2)/height*2,z).unproject(camera);
  planes.forEach((mesh,i)=>{const [x,y,z]=config.offsets[i],spread=layerProgress(config.layerWindows,state,p,i);mesh.position.set(x*unit*spread,-y*unit*spread,.126+z*unit*spread+i*.0001);mesh.material.opacity=1-state.original;});
  device.screen.visible=originalPlane?false:state.original>.001;if(originalPlane)originalPlane.material.opacity=state.original;
 }
 return {draw,get dirty(){return dirty;},refresh(){if(current)draw(current.p,current.rect);dirty=false;},anchors(){return planes.map((mesh,i)=>{const b=manifest.layers[i].bbox;const point=new THREE.Vector3(((b[0]+b[2])/2/manifest.canvas[0]-.5)*w,(.5-(b[1]+b[3])/2/manifest.canvas[1])*h,0);mesh.localToWorld(point);point.project(camera);return {x:(point.x*.5+.5)*innerWidth,y:(-.5*point.y+.5)*innerHeight};});},inspect(){return {planes:planes.length,supportsHidden:supports.every(([object])=>!object.visible),progress:current?.p,depths:planes.map(m=>m.position.z)};},dispose(){root.removeFromParent();textures.forEach(t=>t.dispose());planes.forEach(p=>p.material.dispose());originalPlane?.material.dispose();geometry.dispose();borderGeometry.dispose();borderMaterial.dispose();device.screen.visible=originalScreenVisible;supports.forEach(([object,visible])=>object.visible=visible);}};
}
